'use strict';
require('dotenv').config({ path: './src/.env' });

//const dbConfigEnabled = process.env.ALERT_WATCHDOG_REDIS_CONFIG_ENABLED === 'false' ? false : true;

if (!process.env.ALERT_WATCHDOG_REDIS_CONFIG_ENABLED) {
    process.env.ALERT_WATCHDOG_REDIS_HOST = '127.0.0.1';
    process.env.ALERT_WATCHDOG_REDIS_PORT = 6579;
    process.env.ALERT_WATCHDOG_REDIS_PASSWORD = '';
  }

const dbConfig = {
    host: process.env.ALERT_WATCHDOG_REDIS_HOST,
    port: process.env.ALERT_WATCHDOG_REDIS_PORT,
    password: process.env.ALERT_WATCHDOG_REDIS_PASSWORD
}

module.exports = dbConfig


  