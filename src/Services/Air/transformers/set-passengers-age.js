const moment = require('moment');

module.exports = params => {
    const passengers = params.passengers.map(passenger => {
        const birth = moment(passenger.birthDate.toUpperCase(), 'YYYY-MM-DD');
        return { ...passenger, Age: moment().diff(birth, 'years') };
    });
    return { ...params, passengers };
};
