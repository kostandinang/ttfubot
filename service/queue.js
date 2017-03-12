'use strict';

const
	Config = require('../config'),
	Db = require('../lib/redis');

module.exports = class UpdatesQueue {

	constructor() {
		
	}

	push(obj) {
		Db.lpush(Config.QUEUE_KEY, obj);
	}
	
}