'use strict';

const { saveAlert } = require("../services/alertService");
require('dotenv').config({ path: './src/.env' });
const ErrorData = require('../models/errorModel');
const unhandled = require("unhandled-rejection");
const sendToApi = require("../services/apiService");
const { subscribeToChannel, publishToChannel } = require("./pubSub");
require('../config/databaseConfig')

/**
 * Traite les erreurs fournies en utilisant les options spécifiées.
 *
 * @param {Object} errors - Un objet contenant les erreurs à traiter.
 * @param {Object} options - Un objet contenant les options de traitement des erreurs.
 * @param {Object} [options.api] - Options spécifiques à l'API (facultatif).
 * @param {string} options.api.url - L'URL de l'API à utiliser pour envoyer les erreurs.
 * @param {Object} [options.pubsub] - Options spécifiques à la publication/abonnement (facultatif).
 * @param {string} options.pubsub.channel - Le nom du canal pour la publication/abonnement.
 * @returns {Promise<ErrorData>} - Une Promesse résolue avec l'objet ErrorData représentant la dernière erreur traitée.
 */
function processErrors(errors, options = {}) {
  const errorTypeMap = new Map([
    [EvalError, { level: "Critical", name: "EvalError" }],
    [AggregateError, { level: "Critical", name: "AggregateError" }],
    [RangeError, { level: "High", name: "RangeError" }],
    [ReferenceError, { level: "High", name: "ReferenceError" }],
    [SyntaxError, { level: "Medium", name: "SyntaxError" }],
    [TypeError, { level: "Medium", name: "TypeError" }],
    [URIError, { level: "Low", name: "URIError" }],
    [Error, { level: "Medium", name: "Error" }],
  ]);

  return Promise.all(Object.values(errors).map(async (error) => {
    const { level, name } = errorTypeMap.get(error.constructor) || { level: "Unknown", name: "UnknownError" };
    const errorData = new ErrorData(level, error.message, name);
    saveAlert(errorData);

    if (options.api) {
      sendToApi(options.api.url, errorData);
    }

    if (options.pubsub) {
      subscribeToChannel(options.pubsub.channel);
      publishToChannel(options.pubsub.channel, errorData);
    }

    return errorData;
  }));
}

/**
 * Gère les erreurs non capturées et termine le processus en cas d'erreur, sauf si l'option 'doNotCrash' est définie à true.
 *
 * @param {Function} handler - Le gestionnaire d'erreurs personnalisé à exécuter.
 * @param {Object} [options] - Un objet contenant les options de gestion des erreurs.
 * @param {boolean} [options.doNotCrash=false] - Si true, le processus ne se terminera pas en cas d'erreur non capturée.
 * @returns {Object} - Un objet avec la fonction report pour signaler manuellement les erreurs.
 */
function errorHandler(handler, options = {}) {
  function handleError(error, context) {
    handler(error, context);

    if (options.NoCrash !== true) {
      process.exit(1);
    }
  }

  let rejectionEmitter = unhandled();

  rejectionEmitter.on("unhandledRejection", (error, promise) => {
    handleError(error, {
      promise: promise
    });
  });

  process.on("uncaughtException", (error) => {
    handleError(error, {});
  });

  return {
    report: function reportError(error, context) {
      handleError(error, context);
    }
  };
}

// Exportez les deux fonctions
module.exports = { processErrors, errorHandler };
