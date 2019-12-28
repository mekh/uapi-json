/* eslint-disable no-param-reassign */
const moment = require('moment');

module.exports = params => {
    if (params.fop.type !== 'Card') {
        return params;
    }

    params.fop.type = 'Credit'; // FIXME: determine card type and add it

    const [m, y] = params.creditCard.expDate.split('/');
    params.creditCard.expDate = `${moment().format('YYYY').substring(0, 2)}${y}-${m}`;
    // params.creditCard.type = 'CA'; // determine card type for 1G

    return params;
};
