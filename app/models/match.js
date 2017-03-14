'use strict';

const
	Boom = require('boom'),
	Util = require('../util'),
	Commands = require('../../lib/commands'),
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
		// Set to db
		Db.set('match', obj);
		if (request.payload.notify == 'on') {
			// Broadcast
			let message = `A new match has been created:\n\n*Location*:\n${request.payload.location}\n\n*Date*:\n${request.payload.date}\n\n*Description*:\n${request.payload.desc}\n\nSee ya !`
			Commands.public.broadcastMessage(message, 'CREATE_MATCH');
			reply.redirect('match');
		}
	}

	static remove(request, reply) {
		Db.del('match').then(result => {
			reply({ success: 1 });
		}).catch(err => {
			reply(Boom.badRequest(err.message));
		})
	}
}