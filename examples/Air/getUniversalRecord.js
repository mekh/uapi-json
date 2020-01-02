const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');


const AirService = uAPI.createAirService({
    auth: config,
    debug: 2,
    production: true,
});

const params = {
    universalRecordLocatorCode: 'RLC001',
};

AirService.getUniversalRecord(params).then(
    data => log.debug(data),
    err => log.error(err)
);
