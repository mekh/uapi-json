module.exports = (params) => {
    // eslint-disable-next-line no-param-reassign
    params.business = (params.segments[0].serviceClass === 'Business');
    return params;
};
