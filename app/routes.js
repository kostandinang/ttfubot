'use strict';

const 
	Match = require('./models/match'),
	Log = require('./models/log'),
	User = require('./models/user');

const ROUTES = [
	/**
	 * Route
	 */
	{
		method: 'GET',
		path: '/',
		handler: (request, reply) => {
			return reply.view('index');
		}
	},

	/**
	 * Users
	 */
	{
		method: 'GET',
		path: '/user',
		handler: User.getAllUsers
	},

	/**
	 * Match
	 */
	{
		method: 'GET',
		path: '/match',
		handler: Match.getActive
	},

	/**
	 * Match
	 */
	{
		method: 'GET',
		path: '/log',
		handler: Log.get
	}
]

module.exports = class Routes {
	
	/**
	 * Export all routes
	 * @param {*E} server 
	 */
	constructor(server) {
		ROUTES.forEach(route => {
			server.route(route);
		})
	}
}