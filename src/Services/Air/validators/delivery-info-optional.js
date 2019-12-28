const { AirValidationError } = require('../AirErrors');
const hasAllFields = require('../../../utils/has-all-required-fields');

const requiredFields = ['name', 'street', 'zip', 'country', 'city'];

module.exports = params => {
    if (params.deliveryInformation) {
        hasAllFields(
            params.deliveryInformation,
            requiredFields,
            AirValidationError.DeliveryInformation
        );
    }
};
