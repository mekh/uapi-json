module.exports = function prepareRequest(template, auth, params, uapiVersion) {
    const options = { ...params };
    // adding target branch param from auth variable and render xml
    options.provider = auth.provider;
    options.TargetBranch = auth.targetBranch;
    options.Username = auth.username;
    options.uapiVersion = uapiVersion;
    options.emulatePcc = auth.emulatePcc
        ? auth.emulatePcc.toUpperCase()
        : false;
    return template(options);
};
