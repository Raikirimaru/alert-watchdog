'use strict';

require('dotenv').config({ path: './src/.env' });


function sendToApi(apiUrl, err) {
  const apiUrlEnabled = process.env.ALERT_WATCHDOG_API_URL_ENABLE === 'false' ? false : true;
  // Envoyer les données à l'API en utilisant fetch
  if (!apiUrlEnabled) {
    process.env.ALERT_WATCHDOG_API_URL = undefined;
  } else {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(err),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi des données à l'API");
        }
        return response.json();
      })
      .then(data => {
        console.log("Réponse de l'API: ", data);
      })
      .catch(error => {
        console.error("Une erreur est survenue: ", error);
      })
  }
}

module.exports = sendToApi