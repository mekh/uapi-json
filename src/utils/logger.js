const moment = require('moment');

let logger;

const setLogger = newLogger => {
    logger = newLogger;
};

const log = (level, data) => {
    // eslint-disable-next-line no-console
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:s.SSS')}] [${level}] ${data}`);
};

const serialize = data => data
    .map(item => {
        if (typeof item === 'object') {
            try {
                return JSON.stringify(item);
            } catch (e) {
            //
            }
        }

        return item;
    })
    .join(' ');

logger = {
    log(level, ...data) { log(level, serialize(...data)); },
    fatal(...data) { this.log('FATAL', data); },
    error(...data) { this.log('ERROR', data); },
    warn(...data) { this.log('WARN', data); },
    info(...data) { this.log('INFO', data); },
    debug(...data) { this.log('DEBUG', data); },
    trace(...data) { this.log('TRACE', data); },
};

// Object.defineProperty(logger, 'log', {
//     value(level, ...data) { log(level, serialize(...data)); },
//     writable: false,
// });

module.exports = {
    logger,
    setLogger,
};
