'use strict';

const
	Config = require('../config'),
	Bot = require('./bot'),
	Db = require('./redis'),
	Util = require('./util');


/**
 * Registers a user
 */
function registerUser(message) {
	Db.set('user:' + message.from.id, JSON.stringify(message.from));
	Bot.sendMessage(message.from.id, "User successfuly registered");
}

function unkownCommand(message) {
	Bot.sendMessage(message.from.id, "Unkown Command");
}

module.exports = {
	run: function (message) {
		switch (message.text) {
			case '/register':
				registerUser(message);
				break;
			default:
				unkownCommand(message);
		}
	}
}