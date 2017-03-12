'use strict';

const
	Redis = require('ioredis'),
	Config = require('../config');

const OPTS = {
	keyPrefix: Config.REDIS_KEY_PREFIX + ':'
}

let redis = new Redis(Config.REDIS_URI, OPTS);

redis.on('error', (err) => {
	console.error(err);
})

module.exports = redis;