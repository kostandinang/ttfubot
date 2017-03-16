'use strict';

const 
	Match = require('./models/match'),
	Log = require('./models/log'),
	Home = require('./models/home'),
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
	{
		method: 'GET',
		path: '/public/{param*}',
		handler: {
			directory: {
            path: __dirname + '/public'
        }
		}
	},
	{
		method: 'POST',
		path: '/broadcast',
		handler: Home.broadcast
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
		handler: Match.get
	},
	{
		method: 'POST',
		path: '/match',
		handler: Match.update
	},
	{
		method: 'DELETE',
		path: '/match',
		handler: Match.remove
	},
	{
		method: 'DELETE',
		path: '/match/user',
		handler: Match.removeMatchUser
	},
	
	/**
	 * Log
	 */
	{
		method: 'GET',
		path: '/log',
		handler: Log.get
	},

	{
		method: 'DELETE',
		path: '/log',
		handler: Log.clear
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