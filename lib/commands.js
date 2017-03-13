'use strict';

const
	Config = require('../config'),
	Bot = require('./bot'),
	Db = require('./redis'),
	Util = require('./util');

//-------------------- User --------------------//

/**
 * Subscribes a user
 */
function subscribe(message) {
	Db.set('user:' + message.from.id, JSON.stringify(message.from));
	Bot.sendMessage(message.from.id, "You subscribed successfuly !");
}

/**
 * Unsubscribes a user
 * @param {*} message 
 */
function unsubscribe(message) {
	Db.del('user:' + message.from.id);
	Bot.sendMessage(message.from.id, "Unsubscribed");
}

/**
 * Show all users
 * @param {*} message 
 */
function listUsers(message) {
	Db.keys('*user:*').then(keys => {
		console.log('Users match: ' + keys.length);	
		Bot.sendMessage(message.from.id, keys.length);
	}).catch(err => {
		console.error(err);
	});
}

//-------------------- Match --------------------//

/**
 * Get Match
 * @param {*} message 
 */
function getMatch(message) {
	Db.get('match').then(match => {
		if (match) {
			Bot.sendMessage(message.from.id, JSON.stringify(match));		
		} else {
				sendError(message, 'No active matches, managers are working on it !');
		}
	}).catch(err => {
		console.error(err);
		sendError(message, err.message);
	})
}

/**
 * Removes match
 */
function removeMatch() {
	Db.get('match').then(match => {
		Db.lpush('past_matches', match);
		Db.del('match');
	}).catch(err => {
		console.error(err);
	});
}

//-------------------- Util --------------------//

function info(message) {
	const INFO = `👋  from ${Config.BOT_USERNAME}\n\nBuilt with ❤️️ from ${Config.ADMINISTRATOR_USERNAME} `;
	Bot.sendMessage(message.from.id, INFO);	
}

function sendError(message, text) {
	Bot.sendMessage(message.from.id, text || 'An error occured, Contact to administrator: ' + Config.ADMINISTRATOR_USERNAME);	
}

function unkownCommand(message) {
	Bot.sendMessage(message.from.id, "Unkown Command !");
}

module.exports = {
	run: function (message) {
		switch (message.text) {
			case '/subscribe':
				subscribe(message);
				break;
			case '/unsubscribe':
				unsubscribe(message);
				break;
			case '/list':
				listUsers(message);
				break;
			case '/match':
				getMatch(message);
				break;
			case '/info':
				info(message);
				break;	
			default:
				unkownCommand(message);
		}
	}
}