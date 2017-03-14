'use strict';

const
	Util = require('../util'),
	Db = require('../../lib/redis');

module.exports = class Match {

	/**
	 * Gets active match
	 * @param {*} request 
	 * @param {*} reply 
	 */
	static getActive(request, reply) {

		Db.get('match').then(result => {
			Util.render(reply, 'match', result);
		}).catch(err => {
			Util.renderError(reply, err);
		})
	}

}