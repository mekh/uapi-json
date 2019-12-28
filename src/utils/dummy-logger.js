module.exports = new Proxy({}, {
    get(obj, prop) {
        // eslint-disable-next-line no-param-reassign
        obj[prop] = () => {};
        return obj[prop];
    },
});
