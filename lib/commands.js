'use strict';

const
	UUID = require('uuid/v4'),
	Bot = require('./bot'),
	Db = require('./redis'),
	Msg = require('./messages'),
	Util = require('./util');

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

/**
 * Resends match request to user
 * @param {*Res} message 
 * @param {*} userid 
 */
function request(message, userid) {
	return new Promise((resolve, reject) => {
		let id = userid || message.from.id;
		Db.get('match').then(match => {
			match = JSON.parse(match);
			sendMatchRequestActions(id, Msg.CREATED_MATCH_DETAILS(match));
			resolve(true);
		}).catch(err => {
			reject(err);
		})
	});

}

/**
 * User accepts the match
 */
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

/**
 * User rejects match
 * @param {*} id 
 */
function rejectMatch(id) {
	Bot.sendMessage(id, Msg.MATCH_REJECTED(id));
}

//-------------------- Broadcast --------------------//

/**
 * Broadcast a message to all users
 */
function broadcast(message, type) {
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

/**
 * Broadcast a message to match users only
 */
function broadcastToMatchUsers(message) {
	return new Promise((resolve, reject) => {
		Db.lrange('match_users', 0, 20).then(users => {
			users.forEach(userid => {
				Bot.sendMessage(userid, message).then(result => {
					if (result) {
						resolve(result);
					} else {
						reject(result);
					}
				});
			})
		}).catch(err => {
			reject(err);
		})
	});
}

/**
 * Get latest broadcast message
 */
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

	/**
	 * Respond to queries
	 */
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

	/**
	 * Run command based on message text
	 */
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
	},

	request, request,
	broadcast: broadcast,
	broadcastToMatchUsers: broadcastToMatchUsers,
	CREATED_MATCH_DETAILS: Msg.CREATED_MATCH_DETAILS,
}