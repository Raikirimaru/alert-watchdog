'use strict';
// Importation des modules nécessaires
require('dotenv').config({ path: './src/.env' });
const winston = require('winston');
require('winston-daily-rotate-file');



// Configuration du logger avec les transports
const loggerCfg = (logPath) => {
  const logEnabled = process.env.ALERT_WATCHDOG_LOG_ENABLED === 'false' ? false : true;
  if (!logEnabled) {
    return winston.warn("vous n'avez pas souscription aux log des alerts");
  } else {
    const logger = winston.createLogger({
      transports: [
        // Transport pour les journaux quotidiens rotatifs
        new winston.transports.DailyRotateFile({
          filename: `${logPath}%DATE%.log`, // Nom du fichier journal avec la date actuelle
          datePattern: 'YYYY-MM-DD', // Format de la date dans le nom du fichier
          zippedArchive: false, // Désactivation de l'archivage compressé des fichiers journaux
          maxSize: '450m', // Taille maximale d'un fichier journal avant de créer un nouveau fichier
          maxFiles: '30d', // Nombre de jours pendant lesquels les fichiers journaux sont conservés
          level: 'info', // Niveau de journalisation défini sur "info"
          format: winston.format.combine(
            winston.format.printf((info) => {
              return `${(new Date()).toJSON().replace("T", " ").replace("Z", "")}; ${info.level.toUpperCase()}; ${info.message}`;
            })
          )
        }),
        // Transport pour l'affichage des journaux dans la console
        new (winston.transports.Console)({
          level: 'info', // Niveau de journalisation défini sur "info"
          format: winston.format.combine(
            winston.format.colorize(), // Activation de la coloration des journaux dans la console
            winston.format.printf((info) => {
              return `${(new Date()).toJSON().replace("T", " ").replace("Z", "")}; ${info.level}; ${info.message}`;
            })
          )
        })
      ]
    });
  
    return logger;
  }
};

// Exportation du logger configuré pour une utilisation ultérieure
module.exports.loggerCfg = loggerCfg;





