'use strict';
// Modèle d'alerte
/**
 * Classe représentant une alerte.
 * @class Alert
 **/
class Alert {
  /**
   * Crée une instance d'Alerte.
   * @constructor
   * @param {object} alertData - Les données de l'alerte.
   **/
  constructor(alertData) {
    /**
     * Le message de l'alerte.
     * @type {string}
     **/
    this.name = alertData.name || "";

    /**
     * La description de l'alerte.
     * @type {string}
     **/
    this.message = alertData.message || "";

    /**
     * Le type de l'alerte.
     * @type {string}
     **/
    this.level = alertData.level || "";

    /**
     * Le timestamp de création de l'alerte au format ISO 8601.
     * @type {string}
     **/
    this.timestamp = new Date().toJSON().replace("T", " ").replace("Z", "");
  }
}

module.exports = Alert;

