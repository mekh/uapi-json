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
    commission: {
        amount: 'UAH10',
    },
    fop: {
        type: 'Cash',
    },
    pnr: '8VHKLI',
    ReservationLocator: '0PW5WF',
};

AirService.ticket(params).then(
    data => log.debug(data),
);
