'use strict';

const
	Db = require('../lib/redis');

const QUEUE_KEY = 'updates_queue';

module.exports = class UpdatesQueue {

	constructor() {
		
	}

	push(obj) {
		Db.lpush(QUEUE_KEY, obj);
	}
	
}