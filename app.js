'use strict';

const {processErrors, errorHandler} = require('./src/controllers/errorController')
const loggerCfg = require('./src/config/logger')
const dbredis = require('./src/config/databaseConfig')

function catchError(callback, options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await callback();
        resolve(result);
      } catch (error) {
       await processErrors({ error }, options)
          .then(errorData => reject(errorData))
          .catch(err => reject(err));
      }
    });
  }

/**
 * Expose version. Use `require` method for `webpack` support.
 * @type {string}
 */
exports.version = require('../alert-watchdog/package.json').version;

module.exports = {
    processErrors,
    errorHandler,
    loggerCfg,
    dbredis,
    catchError
}