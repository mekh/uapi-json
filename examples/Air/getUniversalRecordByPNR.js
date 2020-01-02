const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');

const AirService = uAPI.createAirService({
    auth: config,
    debug: 2,
    production: false,
});

const params = {
    pnr: '8VHKLI',
};

AirService.getUniversalRecordByPNR(params).then(
    data => log.debug(data),
);
