const moment = require('moment');
const uAPI = require('../../index');
const config = require('../../test/testconfig');
const { logger: log } = require('../../src/utils/logger');

const AirService = uAPI.createAirService(
    {
        auth: config,
        debug: 2,
        uapiVersion: 'v48_0',
    },
);

const shift = 15;
const delta = 9;
const segment = 0;

const params = {
    legs: [
        {
            from: 'IEV',
            to: 'HKT',
            departureDate: moment().add(shift, 'days').format('YYYY-MM-DD'),
            preferAirportTo: true,
        },
        {
            from: 'HKT',
            to: 'IEV',
            departureDate: moment().add(shift + delta, 'days').format('YYYY-MM-DD'),
            preferAirportFrom: true,
        },
    ],
    passengers: {
        ADT: 1,
        CNN: 1,
        INF: 1,
    },
    cabins: ['Business'],
    requestId: Date.now(),
    // platingCarier: 'PS',
    pricing: {
        currency: 'UAH',
        // eTicketability: 'Yes',
    },
};

AirService.shop(params)
    .then(results => {
        const fromSegments = results[segment].directions[0][0].segments;
        const toSegments = results[segment].directions[1][0].segments;
        const fromTo = fromSegments.concat(toSegments);

        const book = {
            segments: fromTo,
            rule: 'SIP',
            passengers: [
                {
                    lastName: 'SKYWALKER',
                    firstName: 'LUKE',
                    passCountry: 'UA',
                    passNumber: 'ES221731',
                    birthDate: '1968-07-25',
                    gender: 'M',
                    ageCategory: 'ADT',
                },
                {
                    lastName: 'SKYWALKER',
                    firstName: 'ANAKIN',
                    passCountry: 'UA',
                    passNumber: 'ES221732',
                    birthDate: moment().subtract(9, 'years').format('YYYY-MM-DD'),
                    gender: 'F',
                    ageCategory: 'CNN',
                    age: 9,
                },
                {
                    lastName: 'SKYWALKER',
                    firstName: 'SHMI',
                    passCountry: 'UA',
                    // passNumber: 'ES221731',
                    birthDate: moment().subtract(2, 'years').format('YYYY-MM-DD'),
                    gender: 'F',
                    ageCategory: 'INF',
                },
            ],
            phone: {
                countryCode: '38',
                location: 'IEV',
                number: '0660419905',
            },
            deliveryInformation: {
                name: 'Anakin Skywalker',
                street: 'Sands street, 42',
                zip: '42042',
                country: 'UA',
                city: 'Mos Eisley',
            },
            allowWaitlist: true,
        };

        return AirService.book(book).then(
            res => log.debug(res),
        );
    })
    .catch(err => log.error('[BOOKING: ERROR]', err));
