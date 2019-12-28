/* eslint-disable no-param-reassign */
module.exports = params => {
    const passengers = params.passengers.map(passenger => {
        const ssr = (passenger.ssr || []).map(item => {
            if (item.segment !== undefined) {
                const segKey = Object.keys(params['air:AirSegment'])[item.segment];
                item.segmentRef = params['air:AirSegment'][segKey].Key;

                delete (item.segment);
            }

            return item;
        });

        return { ...passenger, ssr };
    });

    return { ...params, passengers };
};
