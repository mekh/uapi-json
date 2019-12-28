const sinon = require('sinon');
const { logger } = require('../src/utils/logger');

before(() => {
    // used to reduce noise in `npm test` output
    sinon.stub(logger, 'log');
});

// eslint-disable-next-line no-console
afterEach(() => logger.log.resetHistory());
