'use strict';

const
	Util = require('../util'),
	Db = require('../../lib/redis');

module.exports = class Match {

	/**
	 * Gets user actions
	 * @param {*} request 
	 * @param {*} reply 
	 */
	static get(request, reply) {

		Db.lrange('logs', 0, 10).then(result => {
			Util.render(reply, 'log', result);
		}).catch(err => {
			Util.renderError(reply, err);
		})
	}

}