'use strict';

const
	Boom = require('boom'),
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

	static update(request, reply) {
		let obj = JSON.stringify(request.payload);
		Db.set('match', obj);
		reply.redirect('match');
	}

	static remove(request, reply) {
		Db.del('match').then(result => {
			reply({success: 1});
		}).catch(err => {
			reply(Boom.badRequest(err.message));
		})
	}
}