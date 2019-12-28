const clone = require('./clone');
/**
 * Apply all transformers to params
 * @param transformers Array<Function>
 */
module.exports = (...transformers) => params => {
    const cloned = clone(params);
    return transformers.reduce((acc, x) => acc.then(x), Promise.resolve(cloned));
};
