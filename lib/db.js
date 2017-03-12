'use strict';

const
	Config = require('../config'),
	Redis = require('./redis');

const OPTIONS = {
	
}

module.exports = {
	set: (key, object) => {
		Redis.set(key, object);
	}
}