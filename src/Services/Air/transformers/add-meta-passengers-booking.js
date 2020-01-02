const moment = require('moment');

module.exports = params => {
    const result = { ...params };
    result.passengers = result.passengers.map(item => {
        const passenger = { ...item };
        const birthSSR = moment(passenger.birthDate.toUpperCase(), 'YYYY-MM-DD');
        const {
            passCountry: country,
            passNumber: num,
            firstName: first,
            lastName: last,
            gender,
        } = passenger;

        const due = moment().add(12, 'month').format('DDMMMYY');
        const birth = birthSSR.format('DDMMMYY');

        if (passenger.ageCategory === 'CNN') {
            passenger.isChild = true;
            if (passenger.Age < 10) {
                passenger.ageCategory = `C0${passenger.Age}`;
            } else {
                passenger.ageCategory = `C${passenger.Age}`;
            }
        }

        passenger.ssr = passenger.ssr || [];

        passenger.ssr.push({
            type: 'FOID',
            text: `PP${country}${num}`,
        });
        passenger.ssr.push({
            type: 'DOCS',
            text: `P/${country}/${num}/${country}/${birth}/${gender}/${due}/${last}/${first}`,
        });

        passenger.DOB = birthSSR.format('YYYY-MM-DD');
        return passenger;
    });

    return result;
};
