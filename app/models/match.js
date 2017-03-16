'use strict';

const
	Boom = require('boom'),
	Util = require('../util'),
	CoreUtil = require('../../lib/util'),
	Commands = require('../../lib/commands'),
	Db = require('../../lib/redis');

module.exports = class Match {

	/**
	 * Gets active match
	 * @param {*} request 
	 * @param {*} reply 
	 */
	static get(request, reply) {
		let response = {};
		Db.get('match').then(match => {
			if (match) {
				response.match = match;
				Db.lrange('match_users', 0, 20).then(users => {
					Promise.all(users.map(id => {
						return Db.get('user:' + id);
					})).then(result => {
						response.matchUsers = result;
						Util.render(reply, 'match', response);
					})
				})
			} else {
				Util.render(reply, 'match', response);
			}
		}).catch(err => {
			Util.renderError(reply, err);
		})
	}

	static update(request, reply) {
		let val = JSON.stringify(request.payload);
		// Set to db
		Db.set('match', val);
		if (request.payload.notify == 'on') {
			// Broadcast
			Commands.public.broadcastMessage(Commands.public.CREATED_MATCH_DETAILS(request.payload), 'CREATE_MATCH');
			reply.redirect('match');
		} else {
			reply.redirect('match');
		}
	}

	static remove(request, reply) {
		Db.del('match').then(result => {
			Db.del('match_users').then(deleted => {
				if (deleted)
					reply({ success: 1 });
				else
					reply({ success: 0 });
			})
		}).catch(err => {
			reply(Boom.badRequest(err.message));
		})
	}

	static removeMatchUser(request, reply) {
		Db.lrem('match_users', 1, request.payload.userid).then(deleted => {
			if (deleted)
				reply({ success: 1 });
			else
				reply({ success: 0 });
		}).catch(err => {
			reply(Boom.badRequest(err.message));
		})
	}

	static request(request, reply) {
		Commands.public.request(null, request.payload.userid).then(res => {
			if (res) reply({sucess: 1})
		}).catch(err => {
			reply(Boom.badRequest(err.message));
		})
	}
}