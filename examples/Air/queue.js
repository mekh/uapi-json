const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');

const AirService = uAPI.createAirService({
    auth: config,
    debug: true,
    production: true,
});

const params = {
    queue: '50',
    pcc: '7777',
    pnr: 'ABCDEF',
};

AirService.toQueue(params).then(
    data => log.debug(data),
    err => log.error(err)
);
