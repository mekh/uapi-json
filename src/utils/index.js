const renameProperty = require('./rename-property');
const firstInObj = require('./first-in-obj');
const beautifyName = require('./beautify-name');
const price = require('./price');
const validate = require('./validate');
const parsers = require('./parsers');
const transform = require('./transform');
const compose = require('./compose');
const hasAllFields = require('./has-all-required-fields');
const inflate = require('./inflate-promise');
const deflate = require('./deflate-promise');
const getBookingFromUr = require('./get-booking-from-ur');
const getErrorPcc = require('./get-error-pcc');
const clone = require('./clone');
const getHashSubstr = require('./getHashSubstr');

const utils = {
    beautifyName,
    clone,
    compose,
    deflate,
    firstInObj,
    getBookingFromUr,
    getErrorPcc,
    getHashSubstr,
    hasAllFields,
    inflate,
    parsers,
    price,
    renameProperty,
    transform,
    validate,
};

module.exports = utils;
