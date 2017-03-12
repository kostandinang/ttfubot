'use strict';

const
	Bot = require('../lib/bot'),
	Config = require('../config'),
	Queue = require('./queue'),
	Looper = require('./looper'),
	Runner = require('./runner'),
	Commands = require('../lib/commands')

module.exports = class Poll {

	constructor() {
		this.lastUpdateID = 0;
		this.Queue = new Queue();
	}

	/**
 * Get updates from bot
 * Keep track of lastUpdateID so it can offset results
 * On successful result add to update queue on db
 */
	getUpdates() {
		Bot.getUpdates(++this.lastUpdateID).then(result => {
			if (result.length > 0) {
				this.lastUpdateID = result[result.length - 1].update_id;
				result.forEach(val => {
					console.log(JSON.stringify(val));
					Commands.run(val.message);
				})
			}
			console.log('Poll: ' + result.length);
		}).catch(err => {
			console.error(err);
		})
	}

	/**
	 * Starts Polling service
	 */
	start() {
		new Looper(this.getUpdates.bind(this), Config.POLL_INTERVAL).start();
	}

}