'use strict';

const
	Config = require('../config'),
	Util = require('../util'),
	Db = require('../../lib/redis');

module.exports = class Match {

	/**
	 * Gets user actions
	 * @param {*} request 
	 * @param {*} reply 
	 */
	static get(request, reply) {

		Db.lrange('logs', 0, Config.LOG_SIZE).then(result => {
			Util.render(reply, 'log', result);
		}).catch(err => {
			Util.renderError(reply, err);
		})
	}

	static clear(request, reply) {

		Db.del('logs').then(result => {
			Util.redirect(reply, 'log');
		}).catch(err => {
			Util.renderError(reply, err);
		})
	}

}