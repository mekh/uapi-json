const { AirValidationError } = require('../AirErrors');
const hasAllFields = require('../../../utils/has-all-required-fields');

const requiredFields = ['number', 'location', 'countryCode'];

module.exports = params => {
    hasAllFields(params, ['phone'], AirValidationError.PhoneMissing);
    hasAllFields(
        params.phone,
        requiredFields,
        AirValidationError.IncorrectPhoneFormat
    );
};
