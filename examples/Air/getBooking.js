const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');


const AirService = uAPI.createAirService({
    auth: config,
    debug: 2,
    production: false,
    uapiVersion: 'v48_0',
});

const params = {
    pnr: '8VHKLI',
};

AirService.getBooking(params).then(
    data => log.debug(data),
);
