module.exports = params => {
    const firstBasis = params.segments
        && params.segments[0]
        && params.segments[0].fareBasisCode;

    return { ...params, hasFareBasis: firstBasis !== undefined && firstBasis !== null };
};
