const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');


const AirService = uAPI.createAirService({
    auth: config,
    debug: 2,
    production: true,
});

const params = [
    {
        airline: 'OS',
        flightNumber: '703',
        departure: '2016-11-21',
    },
    {
        airline: 'OS',
        flightNumber: '703',
        departure: '2016-11-28',
    },
];

AirService.flightInfo(params).then(
    data => log.debug(data),
    err => log.error(err)
);
