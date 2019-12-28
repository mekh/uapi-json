const fs = require('fs');
const path = require('path');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const {
    RequestSoapError,
} = require('../../src/Request/RequestErrors');

const { expect } = chai;
chai.use(sinonChai);

const templates = require('../../src/Services/Air/templates');
const { logger } = require('../../src/utils/logger');

const errorXML = fs.readFileSync(path.join(
    __dirname,
    '../FakeResponses/Other/UnableToFareQuoteError.xml'
)).toString();

const serviceParams = [
    'URL',
    {
        username: 'USERNAME',
        password: 'PASSWORD',
    },
    templates.lowFareSearch,
    null,
    () => ({}),
    () => ({}),
    () => ({}),
];

const serviceParamsReturningString = [
    'URL',
    {
        username: 'USERNAME',
        password: 'PASSWORD',
    },
    templates.lowFareSearch,
    null,
    () => ({}),
    () => ({}),
    () => '',
];

const requestError = proxyquire('../../src/Request/uapi-request', {
    axios: {
        // eslint-disable-next-line prefer-promise-reject-errors
        request: () => Promise.reject({ response: { status: 300, data: 3 } }),
    },
});
const requestUnexpectedError = proxyquire('../../src/Request/uapi-request', {
    axios: {
        // eslint-disable-next-line prefer-promise-reject-errors
        request: () => Promise.reject({ code: 'ECONNRESET', message: 'write ECONNRESET', name: 'Error' }),
    },
});
const requestJsonResponse = proxyquire('../../src/Request/uapi-request', {
    axios: {
        request: () => Promise.resolve({ data: '{"error": "Some error"}' }),
    },
});
const requestXMLResponse = proxyquire('../../src/Request/uapi-request', {
    axios: {
        request: () => Promise.resolve({ data: '<?xml version="1.0" encoding="UTF-8"?><SOAP:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><SOAP:Body><xml>Some xml</xml></SOAP:Body></SOAP:Envelope>' }),
    },
});

const requestXMLError = proxyquire('../../src/Request/uapi-request', {
    axios: {
        request: () => Promise.resolve({ data: errorXML }),
    },
});

describe('#Request', () => {
    describe('Request send', () => {
        it('should throw an SoapRequestError with underlying caused by Error', () => {
            const request = requestError(...serviceParams.concat(3));
            return request({})
                .catch((err) => {
                    expect(err).to.be.an.instanceof(RequestSoapError.SoapRequestError);
                    expect(err.data).to.not.equal(null);
                    expect(err.data.status).to.be.equal(300);
                    expect(err.data.data).to.be.equal(3);
                    expect(logger.log).to.have.callCount(4);
                });
        });
        it('should throw an SoapUnexpectedError with underlying caused by Error without response', () => {
            const request = requestUnexpectedError(...serviceParams.concat(3));
            return request({})
                .catch((err) => {
                    expect(err).to.be.an.instanceof(RequestSoapError.SoapUnexpectedError);
                    expect(err.data).to.not.equal(null);
                    expect(err.data.code).to.equal('ECONNRESET');
                });
        });
        it('should throw SoapServerError when JSON received', () => {
            const request = requestJsonResponse(...serviceParams.concat(3));
            return request({})
                .catch((err) => {
                    expect(err).to.be.an.instanceof(RequestSoapError.SoapServerError);
                    expect(logger.log).to.have.callCount(4);
                });
        });
        it('should call XML parse when XML received', () => {
            const request = requestXMLResponse(...serviceParams.concat(3));
            return request({})
                .then((response) => {
                    expect(response).to.deep.equal({});
                    expect(logger.log).to.have.callCount(6);
                });
        });

        it('should test custom log function with success', () => {
            const log = {
                debug: sinon.spy((...args) => {
                    logger.debug(args);
                })
            };

            const params = serviceParams.concat([3]).concat([{ logFunction: log }]);

            const request = requestXMLResponse(...params);
            return request({})
                .then(() => {
                    expect(log.debug).to.have.callCount(6);
                });
        });

        it('should test custom log function with error', () => {
            const log = {
                error: sinon.spy((...args) => {
                    logger.error(args);
                }),
                debug: sinon.spy((...args) => {
                    logger.debug(args);
                }),
            };

            const params = serviceParams.concat([3]).concat([{ logFunction: log }]);

            const request = requestXMLError(...params);
            return request({})
                .then(() => {
                    expect(log.error).to.have.callCount(1);
                });
        });

        it('should test result of parser as string', () => {
            const log = {
                debug: sinon.spy((...args) => {
                    logger.debug(args);
                }),
                error: logger.error.bind(logger),
            };

            const params = serviceParamsReturningString
                .concat([3])
                .concat([{ logFunction: log }]);

            const request = requestXMLError(...params);
            return request({})
                .then(() => {
                    expect(log.debug).to.have.callCount(5);
                });
        });
    });
});
