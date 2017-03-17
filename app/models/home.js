'use strict';

const
	Promise = require('bluebird'),
	Commands = require('../../lib/commands'),
	Db = require('../../lib/redis'),
	Util = require('../util');

module.exports = class User {

	/**
	 * Get stats
	 * @param {*} request 
	 * @param {*} reply 
	 */
	static stats(request, reply) {

		Db.keys('*user:*').then(result => {
			let users = [];
			Promise.all(result.map((key) => {
				return Db.get(key.substring(8, key.length));
			})).then((data) => {
				Util.render(reply, 'user', data);
			}).catch(err => {
				Util.renderError(reply, err);
			})
		}).catch(err => {
			Util.renderError(reply, err);
		})
	}

	static broadcast(request, reply) {
		if (request.payload.allUsers == "true") {
			Commands.broadcast(request.payload.message).then(result => {
				reply({ success: true });
			}).catch(err => {
				Util.renderError(reply, err);
			});
		} else {
			Commands.broadcastToMatchUsers(request.payload.message).then(result => {
				reply({ success: true })
			}).catch(err => {
				Util.renderError(reply, err);
			})
		}
	}

}