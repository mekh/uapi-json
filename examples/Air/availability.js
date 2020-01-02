const moment = require('moment');
const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');

const AirService = uAPI.createAirService(
    {
        auth: config,
        debug: 2,
        production: false,
        uapiVersion: 'v48_0',
    },
);


const params = {
    legs: [
        {
            from: 'IEV',
            to: 'NYC',
            departureDate: moment().add(55, 'days').format('YYYY-MM-DD'),
        },
    ],
    passengers: {
        ADT: 1,
        CNN: 1,
        INF: 1,
        // INS: 1, //infant with a seat
    },
    // carriers: ['KL'],
    cabins: ['Business'], // [''Economy'],
    requestId: '4e2fd1f8-2221-4b6c-bb6e-cf05c367cf60',
    // permittedConnectionPoints: ['AMS'],
    // preferredConnectionPoints: ['KBP'],
    // prohibitedConnectionPoints: ['DME', 'SVO', 'PAR'],
    // maxJourneyTime: 300,
    pricing: {
        currency: 'UAH',
        eTicketability: true,
    },
};

AirService.availability(params)
    .then(
        res => log.debug(res),
    );
