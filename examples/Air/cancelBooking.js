const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');


const AirService = uAPI.createAirService({
    auth: config,
    debug: 2,
    production: false,
});

const params = {
    pnr: 'PNR001',
    cancelTickets: true,
};

AirService.cancelPNR(params).then(
    data => log.debug(data),
    err => log.error(err),
);
