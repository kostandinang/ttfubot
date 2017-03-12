'use strict';

const
	Bot = require('../lib/bot'),
	Db = require('../lib/redis'),
	Queue = require('./queue'),
	PollInterval = require('./poll_interval');

module.exports = class Poll {

	constructor() {
		this.lastUpdateID = 0;
		this.Queue = new Queue();
	}

	/**
 * Get updates from bot
 * Keep track of lastUpdateID so it can offset results
 * On successful result
 */
	getUpdates() {
		Bot.getUpdates(++this.lastUpdateID).then(result => {
			if (result.length > 0) {
				this.lastUpdateID = result[result.length - 1].update_id;
				result.forEach(val => {
					this.Queue.push(JSON.stringify(val));
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
		let poll = new PollInterval(this.getUpdates.bind(this));
		poll.start();
	}

}