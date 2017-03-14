'use strict';

const
	Promise = require('bluebird'),
	Db = require('../../lib/redis'),
	Util = require('../util');

module.exports = class User {
	
	/**
	 * Get all subscribed users
	 * @param {*} request 
	 * @param {*} reply 
	 */
	static getAllUsers(request, reply) {

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

}