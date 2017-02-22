"use strict";

/**
 * @typedef {object} log
 * @property {Function} debug
 * @property {Function} error
 * @property {Function} info
 * @property {Function} warn
 */

module.exports = (config, debugLibrary, programName) => {
    if (config.debug) {
        debugLibrary.enable(`${debugLibrary.load()} ${programName}`);
    }

    return {
        debug: debugLibrary(programName),
        error: console.error.bind(console),
        info: console.log.bind(console),
        warn: console.warn.bind(console)
    };
};
