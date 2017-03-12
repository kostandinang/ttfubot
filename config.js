'use strict';

require('dotenv').config();

const Config = {
	
	//Environment
	REDIS_URI: process.env.REDIS_URI || 'redis://localhost/',
	REDIS_KEY_PREFIX: process.env.REDIS_KEY_PREFIX || '',
	TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
	BOT_USERNAME: process.env.BOT_USERNAME,

	//Constants
	QUEUE_KEY: 'updates_queue',
	POLL_INTERVAL: 500
};

module.exports = Config;