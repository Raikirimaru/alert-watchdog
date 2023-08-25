'use strict';
// Importation des modules nécessaires
const { createClient } = require('redis');
const { loggerCfg } = require('../config/logger')
const Alert = require('../models/alertModel');
const dbConfig = require('../config/databaseConfig')
require('dotenv').config({ path: './src/.env' });


const LOG_PATH = process.env.ALERT_WATCHDOG_LOG_PATH 

/**
 * @function saveAlert
 * Enregistre une alerte dans Redis et récupère les alertes enregistrées.
 * @param {object} alertData - Les données de l'alerte à enregistrer.
 * @returns {void}
 **/
function saveAlert(alertData) {
  // Configuration de la connexion Redis
  const redisClient = createClient(dbConfig);

  // Gestion des erreurs Redis
  redisClient.on('error', (error) => {
    console.error('Erreur Redis : ', error);
    redisClient.quit();
  });

  redisClient.connect(); // Connexion au serveur Redis
  
  // Enregistrement et récupération des alertes
  redisClient.on('connect', async () => {
    try {
      const alert = new Alert(alertData);

      // Enregistrement de l'alerte dans Redis
      new Promise((resolve, reject) => {
        redisClient.HSET('alert:13', alert, (error, reply) => {
          if (error) {
              loggerCfg(LOG_PATH).error("Erreur lors de l'enregistrement de l'alerte dans Redis : ");
            reject(error);
          } else {
              loggerCfg(LOG_PATH).info("Alerte enregistrée avec succès");
            resolve(reply);
          }
        });
      })

      // Récupération de toutes les alertes enregistrées
      // const alerts = await redisClient.HGETALL('alert:13');
      //console.log(JSON.stringify(alerts, null, 2));
      redisClient.quit();
      
    } catch (error) {
      console.error('Erreur : ', error);
      redisClient.quit();
    }
  });
}


module.exports = {
  saveAlert
};
