'use strict';

const
	UUID = require('uuid/v4'),
	Config = require('../config'),
	Bot = require('./bot'),
	Db = require('./redis'),
	Util = require('./util');

const Msg = {
	REGISTERED_SUCCESS: (message) => {
		return `🖐 *Hello, ${message.from.first_name || "User"}*\n\nYou registered successfuly!\nYou will be notified for upcoming matches.\n\n*Thanks for using TTFU*`;
	},
	INVALID_COMMAND: (message) => {
		return `😕 This Command is invalid !\nClick [/] button to view list of valid commands `;
	},
	HELP: (message) => {
		return `*Commands*\n\nstart - Start Bot and register as a user\n
			*/subscribe* - Register
			*/unsubscribe* - Unregister
			*/list* - List users for the match
			*/match* - Shows active match
			*/request* - Request to approve or reject the match
			*/bcast* - Read latest broadcast message
			*/help* - Prints bot help
			*/info* - Print info\n\nThanks for using TTFU Bot`;
	},
	INFO: (message) => {
		return `👋  from ${Config.BOT_USERNAME}\n\nBuilt with ❤️️ from ${Config.ADMINISTRATOR_USERNAME} `;
	},
	CREATED_MATCH_DETAILS: (match) => {
		return `A new match has been created:\n\n*Location*:\n${match.location}\n\n*Date*:\n${match.date}\n\n*Description*:\n${match.desc}\n\nChoose down below to accept or reject the match, or you can \/request later!`;
	},
	MATCH_DETAILS: (match, users) => {
		let message = `*Next match*\n\n*Location*:\n${match.location}\n\n*Date*:\n${match.date}\n\n*Description*:\n${match.desc}\n\nPlayers:\n`;
		users.map(user => {
			user = JSON.parse(user);
			return (message += `*${user.first_name} ${user.last_name}* ${(user.username) ? ("- @" + user.username) : ""}\n`);
		})
		message += '\n\nYou will be notified 2 hours before match start.\nThank you!\n\n⚽⚽⚽';
		return message;
	},
	ALREADY_ACCEPTED_MATCH: (message) => {
		return 'You have already accepted the match, I know you are eager to play, but *hey*, calm down.';
	},
	MATCH_ACCEPTED: (message) => {
		return 'You accepted the match!\n Enter \/match to view match details\n\n⚽⚽⚽';
	},
	MATCH_REJECTED: (message) => {
		return 'You rejected the match! Enter \/request if you change your mind'
	},
	MATCH_MAX_NUMBER: (message) => {
		return '😕 Sorry, there is no place left for you this match, Use command /list to view current players';
	},
	NO_ACTIVE_MATCH: (message) => {
		return '😕 No active matches, managers are working on it !';
	},
	MATCH_USERS: (message, users) => {
		let output = '';
		if (users.length) {
			output = `*Players for this match:\n\n*`;
			users.map(user => {
				user = JSON.parse(user);
				return (output += `*${user.first_name} ${user.last_name}* ${(user.username) ? ("- @" + user.username) : ""}\n`);
			})
		} else {
			return '😕 *No other players accepted this match yet !*'
		}
		return output;
	},
	ERROR: 'An error occured, Contact to administrator: ' + Config.ADMINISTRATOR_USERNAME
}

//-------------------- User --------------------//

/**
 * Subscribes a user
 */
function subscribe(message) {
	message.from.time = Util.getFormattedDate(Date.now());
	Db.set('user:' + message.from.id, JSON.stringify(message.from));
	Bot.sendMessage(message.from.id, Msg.REGISTERED_SUCCESS(message));
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
	Db.get('match').then(match => {
		if (!match) {
			Bot.sendMessage(message.from.id, Msg.NO_ACTIVE_MATCH(message));
		} else {
			Db.lrange('match_users', 0, 20).then(users => {
				Promise.all(users.map(id => {
					return Db.get('user:' + id);
				})).then(result => {
					Bot.sendMessage(message.from.id, Msg.MATCH_USERS(message, result));
				})
			})
		}
	}).catch(err => {
		console.error(err);
	});
}

//-------------------- Match --------------------//

function request(message) {

}

/**
 * Get Match
 * @param {*} message 
 */
function getMatch(message) {
	Db.get('match').then(match => {
		if (match) {
			match = JSON.parse(match);
			Bot.sendMessage(message.from.id, Msg.MATCH_DETAILS(match, []));
		} else {
			sendError(message, Msg.NO_ACTIVE_MATCH(message));
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

/**
 * Sends a match request and waits for callback
 * @param {*} id 
 * @param {*} message 
 */
function sendMatchRequestActions(id, message) {
	let keyboard = {
		inline_keyboard: [
			[
				{
					text: '👍',
					callback_data: '/matchAccept'
				},
				{
					text: '👎',
					callback_data: '/matchReject'
				}
			],
		]
	};
	Bot.sendMessage(id, message, {
		markup: JSON.stringify(keyboard)
	}).then(result => {
		console.log('Sent match actions');
	}).catch(err => {
		console.error(err);
	})
}

function acceptMatch(id) {
	Db.get('match').then(match => {
		/**
		 * Get active match and compare accepted users length to be
		 * one less than max number so this user can register
		 */
		if (match) {
			match = JSON.parse(match);
			Db.llen('match_users').then(userNumber => {
				if ((userNumber + 1) <= match.max) {
					Db.lrange('match_users', 0, 20).then(users => {
						let acceptedUser = users.map(userid => {
							return userid == id;
						})
						if (acceptedUser.length > 0 && acceptedUser[0]) {
							Bot.sendMessage(id, Msg.ALREADY_ACCEPTED_MATCH());
						} else {
							Db.lpush('match_users', id).then(result => {
								if (result == 1) console.log('User ' + id + ' accepted match request');
							})
							Bot.sendMessage(id, Msg.MATCH_ACCEPTED());
						}
					})
				} else {
					Bot.sendMessage(id, Msg.MATCH_MAX_NUMBER());
				}
			})
		} else {
			Bot.sendMessage(id, Msg.NO_ACTIVE_MATCH());
		}
	}).catch(err => {
		console.error(err);
	});
}

function rejectMatch(id) {
	Bot.sendMessage(id, 'You rejected the match! Enter \/request if you change your mind');
}

//-------------------- Broadcast --------------------//

function broadcastMessage(message, type) {

	return new Promise((resolve, reject) => {
		Db.set('broadcast', message);
		Db.keys('*user:*').then(result => {
			Promise.all(result.map((key) => {
				return Db.get(Util.getCacheKey(key));
			})).then((data) => {
				data.forEach(user => {
					user = JSON.parse(user);
					if (type == 'CREATE_MATCH') {
						sendMatchRequestActions(user.id, message);
					} else {
						Bot.sendMessage(user.id, message).then(ok => {
							resolve(true);
						});
					}
				})
			})
		}).catch(err => {
			reject(err);
		});
	})
}


function readBroadcast(message) {
	Db.get('broadcast').then(text => {
		if (text) Bot.sendMessage(message.from.id, text);
	}).catch(err => {
		console.error(err);
	})
}

//-------------------- Util --------------------//

function info(message) {
	Bot.sendMessage(message.from.id, Msg.INFO(message));
}

function help(message) {
	Bot.sendMessage(message.from.id, Msg.HELP(message));
}

function sendError(message, text) {
	Bot.sendMessage(message.from.id, text || Msg.ERROR);
}

function invalidCommand(message) {
	Bot.sendMessage(message.from.id, Msg.INVALID_COMMAND(message));
}

/**
 * Push to logs
 * @param {*} message 
 */
function log(message) {
	let log = {
		id: UUID(),
		user: message.from.username,
		action: message.text,
		data: JSON.stringify(message),
		time: Date.now()
	};
	Db.lpush('logs', JSON.stringify(log));
}

module.exports = {
	public: {
		broadcastMessage: broadcastMessage,
		CREATED_MATCH_DETAILS: Msg.CREATED_MATCH_DETAILS
	},
	callback: function (query) {
		switch (query.data) {
			case '/matchAccept':
				acceptMatch(query.from.id);
				break;
			case '/matchReject':
				rejectMatch(query.from.id);
				break;
		}
	},
	run: function (message) {
		log(message);
		switch (message.text) {
			case '/start':
				subscribe(message);
				break;
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
			case '/request':
				request(message);
				break;	
			case '/bcast':
				readBroadcast(message);
				break;
			case '/info':
				info(message);
				break;
			case '/help':
				help(message);
				break;
			default:
				invalidCommand(message);
		}
	}
}