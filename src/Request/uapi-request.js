const handlebars = require('handlebars');
const axios = require('axios');
const {
    RequestValidationError,
    RequestRuntimeError,
    RequestSoapError,
} = require('./RequestErrors');
const Parser = require('./uapi-parser');
const errorsConfig = require('./errors-config');
const prepareRequest = require('./prepare-request');
const configInit = require('../config');
const { logger } = require('../utils/logger');

handlebars.registerHelper('equal', require('handlebars-helper-equal'));

const validateParams = (service, auth, reqType) => {
    if (!service || service.length <= 0) {
        throw new RequestValidationError.ServiceUrlMissing();
    }
    if (!auth || auth.username === undefined || auth.password === undefined) {
        throw new RequestValidationError.AuthDataMissing();
    }
    if (reqType === undefined) {
        throw new RequestValidationError.RequestTypeUndefined();
    }
    if (Object.prototype.toString.call(reqType) !== '[object String]') {
        throw new RequestRuntimeError.TemplateFileMissing();
    }
};

/**
 * basic function for requests/responses
 * @param  {string} service          service url for current response (gateway)
 * @param  {object} credentials      {username,password,targetBranch,provider} - credentials
 * @param  {string} reqType          url to file with xml for current request
 * @param  {object} rootObject
 * @param  {function} validateFunction function for validation
 * @param  {function} errorHandler    function that gets SOAP:Fault object and handle error
 * @param  {function} parseFunction    function for transforming json soap object to normal object
 * @param  {boolean} debugMode        true - log requests, false - dont
 * @param  {object} options
 * @return {Promise}                  returning promise for best error handling ever)
 */
module.exports = (
    service,
    credentials,
    reqType,
    rootObject,
    validateFunction,
    errorHandler,
    parseFunction,
    debugMode = false,
    options = {},
) => {
    // Assign default value
    const auth = { ...credentials };
    auth.provider = auth.provider || '1G';
    auth.region = auth.region || 'emea';

    const config = configInit(auth.region, options.production);
    const log = options.logFunction || logger;
    const uapiVersion = options.uapiVersion || 'v47_0';

    // Performing checks
    validateParams(service, auth, reqType);


    return parameters => {
        let params = { ...parameters };
        if (debugMode) {
            log.debug('Input params:', params);
        }

        // create uAPI parser with default params and request data in env
        const uParser = new Parser(rootObject, uapiVersion, params, debugMode, null, auth.provider);

        const validateInput = () => (
            Promise.resolve(params)
                .then(validateFunction)
                .then(validatedParams => {
                    params = validatedParams;
                    uParser.env = validatedParams;
                    return reqType;
                }));

        const sendRequest = xml => {
            if (debugMode) {
                log.debug('Request URL:', service);
                log.debug('Request XML:', xml);
            }
            return axios.request({
                url: service,
                method: 'POST',
                timeout: config.timeout || 5000,
                auth: {
                    username: auth.username,
                    password: auth.password,
                },
                headers: {
                    'Accept-Encoding': 'gzip',
                    'Content-Type': 'text/xml',
                },
                data: xml,
            })
                .then(response => {
                    if (debugMode) {
                        log.debug('Response SOAP:', response.data);
                    }
                    return response.data;
                })
                .catch(e => {
                    const rsp = e.response;

                    if (!rsp) {
                        if (debugMode) {
                            log.error('Unexpected Error:', e);
                        }

                        return Promise.reject(new RequestSoapError.SoapUnexpectedError(e));
                    }

                    const error = {
                        status: rsp.status,
                        data: rsp.data,
                    };

                    if (debugMode) {
                        log.error('Error Response SOAP:', error);
                    }

                    return Promise.reject(new RequestSoapError.SoapRequestError(error));
                });
        };

        const parseResponse = response => {
            // if there are web server or HTTP auth errors, uAPI returns a JSON
            let data = null;
            try {
                data = JSON.parse(response);
            } catch (err) {
                return uParser.parse(response);
            }

            // TODO parse JSON errors
            return Promise.reject(new RequestSoapError.SoapServerError(data));
        };

        const validateSOAP = parsedXML => {
            if (parsedXML['SOAP:Fault']) {
                if (debugMode > 2) {
                    log.error('Parsed error response', parsedXML);
                }
                // use a special uAPI parser configuration for errors, copy detected uAPI version
                const errParserConfig = errorsConfig();
                const errParser = new Parser(
                    rootObject,
                    uParser.uapi_version,
                    params,
                    debugMode,
                    errParserConfig,
                    auth.provider,
                );
                const errData = errParser.mergeLeafRecursive(parsedXML['SOAP:Fault'][0]); // parse error data
                return errorHandler.call(errParser, errData);
            }

            if (debugMode > 2) {
                log.debug('Parsed response:', parsedXML);
            }

            return parsedXML;
        };

        const handleSuccess = result => {
            if (debugMode > 1) {
                log.debug('Returning result:', result);
            }
            return result;
        };


        return validateInput()
            .then(handlebars.compile)
            .then(template => prepareRequest(template, auth, params, uapiVersion))
            .then(sendRequest)
            .then(parseResponse)
            .then(validateSOAP)
            .then(parseFunction.bind(uParser)) // TODO: merge Hotels
            .then(handleSuccess);
    };
};
