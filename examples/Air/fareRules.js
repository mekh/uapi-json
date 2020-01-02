const moment = require('moment');
const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');

const AirService = uAPI.createAirService(
    {
        auth: config,
        debug: 2,
        production: false,
        options: {
            uapiVersion: 'v48_0'
        }
    }
);

const requestPTC = 'ADT';

const shopParams = {
    legs: [
        {
            from: 'LOS',
            to: 'IST',
            departureDate: moment().add(55, 'days').format('YYYY-MM-DD'),
        },
        {
            from: 'IST',
            to: 'LOS',
            departureDate: moment().add(60, 'days').format('YYYY-MM-DD'),
        },
    ],
    passengers: {
        [requestPTC]: 1,
    },
    cabins: ['Economy'],
    requestId: 'test',
};

AirService.shop(shopParams)
    .then(results => {
        const forwardSegments = results['0'].directions['0']['0'].segments;
        const backSegments = results['0'].directions['1']['0'].segments;

        const fareRulesParams = {
            segments: forwardSegments.concat(backSegments),
            passengers: shopParams.passengers,
            long: true,
            requestId: 'test',
        };

        return AirService.fareRules(fareRulesParams);
    })
    .then(
        res => log.debug(res),
        err => log.error(err)
    )
    .catch(err => {
        log.error(err);
    });
