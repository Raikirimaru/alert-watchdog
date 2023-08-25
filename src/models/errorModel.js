'use strict';
/**
 * @class ErrorData
 * @classdesc Représente une structure de données pour stocker les détails d'une erreur.
 * @param {string} level - Niveau de gravité de l'erreur (Critical, High, Medium ou Low).
 * @param {string} message - Message d'erreur décrivant la nature de l'erreur.
 * @param {string} name - Nom du type d'erreur (par exemple, EvalError, RangeError, etc.).
 **/
class ErrorData {
    constructor(level, message, name) {
      this.level = level;
      this.message = message;
      this.name = name;
    }
  }

module.exports = ErrorData;

