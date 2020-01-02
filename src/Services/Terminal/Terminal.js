const screenLib = require('galileo-screen');
const { TerminalRuntimeError } = require('./TerminalErrors');
const terminalService = require('./TerminalService');
const validateServiceSettings = require('../../utils/validate-service-settings');
const { getHashSubstr } = require('../../utils');
const { logger } = require('../../utils/logger');

const TERMINAL_STATE_NONE = 'TERMINAL_STATE_NONE';
const TERMINAL_STATE_BUSY = 'TERMINAL_STATE_BUSY';
const TERMINAL_STATE_READY = 'TERMINAL_STATE_READY';
const TERMINAL_STATE_CLOSED = 'TERMINAL_STATE_CLOSED';
const TERMINAL_STATE_ERROR = 'TERMINAL_STATE_ERROR';

const screenFunctions = screenLib({ cursor: '><' });

module.exports = function (settings) {
    const service = terminalService(validateServiceSettings(settings));
    const log = (settings.options && settings.options.logFunction) || logger;
    const emulatePcc = settings.auth.emulatePcc || false;
    const timeout = settings.timeout || false;
    const debug = settings.debug || 0;
    const autoClose = settings.autoClose === undefined
        ? true
        : settings.autoClose;

    const defaultStopMD = screens => !screenFunctions.hasMore(screens);
    const token = settings.auth.token || null;

    const state = {
        terminalState: TERMINAL_STATE_NONE,
        sessionToken: token,
    };
    // Processing response with MD commands
    const processResponse = (response, stopMD, previousResponse = null) => {
        const processedResponse = previousResponse
            ? screenFunctions.mergeResponse(
                previousResponse,
                response.join('\n'),
            )
            : response.join('\n');
        if (stopMD(processedResponse)) {
            return processedResponse;
        }
        return service.executeCommand({
            sessionToken: state.sessionToken,
            command: 'MD',
        }).then(mdResponse => (
            mdResponse.join('\n') === response.join('\n')
                ? processedResponse
                : processResponse(mdResponse, stopMD, processedResponse)
        ));
    };
    // Getting session token
    const getSessionToken = () => new Promise((resolve, reject) => {
        if (state.terminalState === TERMINAL_STATE_BUSY) {
            reject(new TerminalRuntimeError.TerminalIsBusy());
            return;
        }
        if (state.terminalState === TERMINAL_STATE_CLOSED) {
            reject(new TerminalRuntimeError.TerminalIsClosed());
            return;
        }
        Object.assign(state, {
            terminalState: TERMINAL_STATE_BUSY,
        });
        // Return token if already obtained
        if (state.sessionToken !== null) {
            resolve(state.sessionToken);
            return;
        }
        // Getting token
        service.getSessionToken({ timeout })
            .then(tokenData => {
                // Remember session token
                Object.assign(state, tokenData);
                // Return if no emulation needed
                if (!emulatePcc) {
                    return tokenData.sessionToken;
                }
                // Emulate pcc
                return service.executeCommand({
                    sessionToken: tokenData.sessionToken,
                    command: `SEM/${emulatePcc}/AG`,
                }).then(response => {
                    if (!response[0].match(/^PROCEED/)) {
                        return Promise.reject(new TerminalRuntimeError.TerminalEmulationFailed(response));
                    }
                    return Promise.resolve(tokenData.sessionToken);
                });
            })
            .then(resolve)
            .catch(reject);
    });
    // Get terminal ID
    const getTerminalId = sessionToken => getHashSubstr(sessionToken);

    const terminal = {
        getToken: getSessionToken,
        executeCommand: (command, stopMD = defaultStopMD) => new Promise(async (resolve, reject) => {
            try {
                const sessionToken = await getSessionToken();
                const terminalId = getTerminalId(sessionToken);

                if (debug) {
                    log.debug(`[${terminalId}] Terminal request: ${command}`);
                }

                const screen = await service.executeCommand({ command, sessionToken });
                const response = await processResponse(screen, stopMD);

                if (debug) {
                    log.debug(`[${terminalId}] Terminal response: ${response}`);
                }

                Object.assign(state, {
                    terminalState: TERMINAL_STATE_READY,
                });

                resolve(response);
            } catch (err) {
                Object.assign(state, {
                    terminalState: TERMINAL_STATE_ERROR,
                });
                reject(err);
            }
        }),
        closeSession: () => getSessionToken()
            .then(
                sessionToken => service.closeSession({
                    sessionToken,
                }),
            ).then(
                (response) => {
                    Object.assign(state, {
                        terminalState: TERMINAL_STATE_CLOSED,
                    });
                    return response;
                },
            ),
    };

    const isNotClosed = terminalState => {
        const stateNotClosed = [TERMINAL_STATE_BUSY, TERMINAL_STATE_READY, TERMINAL_STATE_ERROR];
        return stateNotClosed.indexOf(terminalState) !== -1;
    };

    if (autoClose) {
        // Adding event handler on beforeExit and exit process events
        process.on('beforeExit', () => {
            if (isNotClosed(state.terminalState)) {
                if (state.terminalState === TERMINAL_STATE_BUSY) {
                    log.warn('UAPI-JSON WARNING: Process exited before completing TerminalService request');
                }
                if (state.sessionToken !== null) {
                    log.warn('UAPI-JSON WARNING: Process left TerminalService session open');
                    log.warn('UAPI-JSON WARNING: Session closing');
                    terminal.closeSession().then(
                        () => log.warn('UAPI-JSON WARNING: Session closed'),
                    ).catch(
                        () => {
                            throw new TerminalRuntimeError.ErrorClosingSession();
                        },
                    );
                }
            }
        });
        /* istanbul ignore next */
        process.on('exit', () => {
            if (isNotClosed(state.terminalState)) {
                if (state.terminalState === TERMINAL_STATE_BUSY) {
                    log.warn('UAPI-JSON WARNING: Process exited before completing TerminalService request');
                }
                if (state.sessionToken !== null) {
                    log.warn('UAPI-JSON WARNING: Process left TerminalService session open');
                }
            }
        });
    }

    return terminal;
};
