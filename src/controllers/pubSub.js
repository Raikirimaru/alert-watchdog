'use strict';

const dbconfig = require('../config/databaseConfig')
require('dotenv').config({ path: './src/.env' });
const redis = require('redis')



module.exports = (function () {
  
  /**
   * Publie des erreurs sur un canal Redis spécifié.
   * @param {string} channel - Le nom du canal sur lequel publier les erreurs.
   * @param {Object} errors - Les erreurs à publier. Doit être un objet JSON.
   * @throws {Error} Une erreur est levée si la configuration Redis est désactivée.
   */
  async function publishToChannel(channel, errors) {
    const pubSubEnabled = process.env.ALERT_WATCHDOG_REDIS_PUBSUB_ENABLED === 'false' ? false : true;
    if (!pubSubEnabled) {
      console.info("Configuration Redis désactivée. Impossible d'utiliser PUB/SUB pour les alerts.");
    } else {
      // Crée un client Redis pour la publication
      const publish = redis.createClient(dbconfig);

      try {
        // Se connecte au serveur Redis
        await publish.connect();

        // Publie les erreurs sur le canal spécifié
        await new Promise(async (resolve, reject) => {
          await publish.PUBLISH(channel, JSON.stringify(errors, null, 2))
            .catch((err) => {
              console.error(`Erreur de publication : ${err}`);
              reject(err);
            })
            .finally(() => {
              console.log(`Message publié sur le canal ${channel}.`);
              resolve(channel);
            });
        });
      } catch (err) {
        console.error(`Erreur lors de la publication des erreurs : ${err}`);
      } finally {
        // Ferme la connexion au client Redis
        await publish.quit();
      }
    }
  }

  /**
   * S'abonne à un canal Redis spécifié pour recevoir des messages.
   * @param {string} channel - Le nom du canal auquel s'abonner.
   * @throws {Error} Une erreur est levée si la configuration Redis est désactivée.
   */
  async function subscribeToChannel(channel) {
    const pubSubEnabled = process.env.ALERT_WATCHDOG_REDIS_PUBSUB_ENABLED === 'false' ? false : true;
    if (!pubSubEnabled) {
      console.info("Configuration Redis désactivée. Impossible d'utiliser PUB/SUB pour les alerts.");
    } else {
      // Crée un client Redis pour la souscription
      const redisClient = redis.createClient(dbconfig);

      // Duplique le client pour la souscription
      const subscriber = redisClient.duplicate();

      try {
        // Se connecte au serveur Redis
        await subscriber.connect();

        // S'abonne au canal spécifié pour recevoir des messages
        await subscriber.SUBSCRIBE(channel, (message) => {
          console.log(`Souscription réussie au canal ${channel} : ${message}`);
        }).catch((err) => {
          console.error("Erreur de souscription : ", err);
        });
      } catch (err) {
        console.error(`Erreur lors de la souscription au canal ${channel} : ${err}`);
      } finally {
        // Ferme la connexion au client Redis
        await subscriber.quit();
      }
    }
  }
  return {
    publishToChannel,
    subscribeToChannel
  }
})()


