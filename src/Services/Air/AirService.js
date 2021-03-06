const uApiRequest = require('../../Request/uapi-request');
const AirParser = require('./AirParser');
const AirValidator = require('./AirValidator');
const getConfig = require('../../config');
const templates = require('./templates');

module.exports = function (settings) {
    const {
        auth, debug, production, options, uapiVersion = 'v48_0',
    } = settings;

    const {
        AirService, UniversalRecord, FlightService, GdsQueueService,
    } = getConfig(auth.region, production);

    const config = { ...options, uapiVersion, production };

    return {
        searchLowFares: uApiRequest(
            AirService.url,
            auth,
            templates.lowFareSearch(uapiVersion),
            'air:LowFareSearchRsp',
            AirValidator.AIR_LOW_FARE_SEARCH_REQUEST,
            AirParser.AIR_ERRORS,
            AirParser.AIR_LOW_FARE_SEARCH_REQUEST,
            debug,
            config,
        ),
        searchLowFaresAsync: uApiRequest(
            AirService.url,
            auth,
            templates.lowFareSearch(uapiVersion),
            'air:LowFareSearchAsynchRsp',
            AirValidator.AIR_LOW_FARE_SEARCH_REQUEST,
            AirParser.AIR_ERRORS,
            AirParser.AIR_LOW_FARE_SEARCH_REQUEST,
            debug,
            config,
        ),
        searchLowFaresRetrieve: uApiRequest(
            AirService.url,
            auth,
            templates.retrieveLowFareSearch(uapiVersion),
            'air:RetrieveLowFareSearchRsp',
            AirValidator.AIR_RETRIEVE_LOW_FARE_SEARCH_REQUEST,
            AirParser.AIR_ERRORS,
            AirParser.AIR_LOW_FARE_SEARCH_REQUEST,
            debug,
            config,
        ),
        availability: uApiRequest(
            AirService.url,
            auth,
            templates.availability(uapiVersion),
            'air:AvailabilitySearchRsp',
            AirValidator.AIR_LOW_FARE_SEARCH_REQUEST,
            AirParser.AIR_ERRORS,
            AirParser.AIR_AVAILABILITY,
            debug,
            config,
        ),
        airPrice: uApiRequest(
            AirService.url,
            auth,
            templates.price(uapiVersion),
            'air:AirPriceRsp',
            AirValidator.AIR_PRICE_REQUEST,
            AirParser.AIR_ERRORS,
            AirParser.AIR_PRICE_REQUEST,
            debug,
            config,
        ),
        lookupFareRules: uApiRequest(
            AirService.url,
            auth,
            templates.price(uapiVersion),
            'air:AirPriceRsp',
            AirValidator.AIR_PRICE_FARE_RULES_REQUEST,
            AirParser.AIR_ERRORS,
            AirParser.AIR_PRICE_FARE_RULES_REQUEST,
            debug,
            config,
        ),
        airPricePricingSolutionXML: uApiRequest(
            AirService.url,
            auth,
            templates.price(uapiVersion),
            null, // intentionally, no parsing; we need raw XML
            AirValidator.AIR_PRICE,
            AirParser.AIR_ERRORS,
            AirParser.AIR_PRICE_REQUEST_PRICING_SOLUTION_XML,
            debug,
            config,
        ),
        createReservation: uApiRequest(
            AirService.url,
            auth,
            templates.createReservation(uapiVersion),
            'universal:AirCreateReservationRsp',
            AirValidator.AIR_CREATE_RESERVATION_REQUEST,
            AirParser.AIR_ERRORS,
            AirParser.AIR_CREATE_RESERVATION_REQUEST,
            debug,
            config,
        ),
        ticket: uApiRequest(
            AirService.url,
            auth,
            templates.ticket(uapiVersion),
            'air:AirTicketingRsp',
            AirValidator.AIR_TICKET, // checks for PNR
            AirParser.AIR_ERRORS,
            AirParser.AIR_TICKET_REQUEST,
            debug,
            config,
        ),
        getUniversalRecordByPNR: uApiRequest(
            UniversalRecord.url,
            auth,
            templates.universalRecordImport(uapiVersion),
            'universal:UniversalRecordImportRsp',
            AirValidator.AIR_REQUEST_BY_PNR, // checks for PNR
            AirParser.AIR_ERRORS,
            AirParser.AIR_IMPORT_REQUEST,
            debug,
            config,
        ),
        getUniversalRecord: uApiRequest(
            UniversalRecord.url,
            auth,
            templates.universalRecordRetrieve(uapiVersion),
            'universal:UniversalRecordRetrieveRsp',
            AirValidator.UNIVERSAL_RECORD_RETRIEVE,
            AirParser.AIR_ERRORS,
            AirParser.UNIVERSAL_RECORD_RETRIEVE_REQUEST,
            debug,
            config,
        ),
        gdsQueue: uApiRequest(
            GdsQueueService.url,
            auth,
            templates.gdsQueuePlace(uapiVersion),
            'gdsQueue:GdsQueuePlaceRsp', // TODO rewrite into uAPI parser
            AirValidator.GDS_QUEUE_PLACE,
            AirParser.AIR_ERRORS,
            AirParser.GDS_QUEUE_PLACE_RESPONSE,
            debug,
            config,
        ),
        foid: uApiRequest(
            UniversalRecord.url,
            auth,
            templates.universalRecordFoid(uapiVersion),
            'universal:UniversalRecordModifyRsp',
            AirValidator.UNIVERSAL_RECORD_FOID,
            AirParser.AIR_ERRORS,
            AirParser.UNIVERSAL_RECORD_FOID,
            debug,
            config,
        ),
        cancelUR: uApiRequest(
            UniversalRecord.url,
            auth,
            templates.universalRecordCancelUr(uapiVersion),
            null, // TODO rewrite into uAPI parser
            AirValidator.AIR_CANCEL_UR,
            AirParser.AIR_ERRORS,
            AirParser.AIR_CANCEL_UR,
            debug,
            config,
        ),
        flightInfo: uApiRequest(
            FlightService.url,
            auth,
            templates.flightInformation(uapiVersion),
            'air:FlightInformationRsp',
            AirValidator.AIR_FLIGHT_INFORMATION,
            AirParser.AIR_ERRORS,
            AirParser.AIR_FLIGHT_INFORMATION,
            debug,
            config,
        ),
        getTicket: uApiRequest(
            AirService.url,
            auth,
            templates.retrieveDocument(uapiVersion),
            'air:AirRetrieveDocumentRsp',
            AirValidator.AIR_GET_TICKET,
            AirParser.AIR_ERRORS,
            AirParser.AIR_GET_TICKET,
            debug,
            config,
        ),
        getTickets: uApiRequest(
            AirService.url,
            auth,
            templates.retrieveDocument(uapiVersion),
            'air:AirRetrieveDocumentRsp',
            AirValidator.AIR_GET_TICKETS,
            AirParser.AIR_GET_TICKETS_ERROR_HANDLER,
            AirParser.AIR_GET_TICKETS,
            debug,
            config,
        ),
        cancelTicket: uApiRequest(
            AirService.url,
            auth,
            templates.voidDocument(uapiVersion),
            'air:AirVoidDocumentRsp',
            AirValidator.AIR_CANCEL_TICKET,
            AirParser.AIR_ERRORS,
            AirParser.AIR_CANCEL_TICKET,
            debug,
            config,
        ),
        cancelPNR: uApiRequest(
            AirService.url,
            auth,
            templates.cancel(uapiVersion),
            'universal:AirCancelRsp',
            AirValidator.AIR_CANCEL_PNR,
            AirParser.AIR_ERRORS,
            AirParser.AIR_CANCEL_PNR,
            debug,
            config,
        ),

        exchangeQuote: uApiRequest(
            AirService.url,
            auth,
            templates.exchangeQuote(uapiVersion),
            null,
            AirValidator.AIR_EXCHANGE_QUOTE,
            AirParser.AIR_ERRORS,
            AirParser.AIR_EXCHANGE_QUOTE,
            debug,
            config,
        ),

        exchangeBooking: uApiRequest(
            AirService.url,
            auth,
            templates.exchange(uapiVersion),
            'air:AirExchangeRsp',
            AirValidator.AIR_EXCHANGE,
            AirParser.AIR_ERRORS,
            AirParser.AIR_EXCHANGE,
            debug,
            config,
        ),
    };
};
