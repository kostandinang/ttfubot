'use strict';

const
	Promise = require('bluebird'),
	Db = require('../../lib/redis'),
	Util = require('../util'),
	CoreUtil = require('../../lib/util');

module.exports = class User {

	/**
	 * Get all subscribed users
	 * @param {*} request 
	 * @param {*} reply 
	 */
	static getAllUsers(request, reply) {

		Db.keys('*user:*').then(result => {
			Promise.all(result.map((key) => {
				return Db.get(CoreUtil.getCacheKey(key));
			})).then((data) => {
				Util.render(reply, 'user', data);
			})
		}).catch(err => {
			Util.renderError(reply, err);
		})
	}

}