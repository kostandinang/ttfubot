'use strict';

const
	Config = require('../config');

const Msg = {

	HELP: () => {
		return `*Commands*\n\n
			/start - Start Bot and register as a user
			/subscribe - Register
			/unsubscribe - Unregister
			/list - List users for the match
			/match - Shows active match
			/request - Request to approve or reject the match
			/bcast - Read latest broadcast message
			/help - Prints bot help
			/info - Print info\n\nThanks for using TTFU Bot`;
	},

	REGISTERED_SUCCESS: (message) => {
		return `🖐 *Hello, ${message.from.first_name || "User"}*\n\nYou registered successfuly!\nYou will be notified for upcoming matches.\n\n*Thanks for using TTFU*`;
	},

	INVALID_COMMAND: () => {
		return `😕 This Command is invalid !\nClick [/] button to view list of valid commands `;
	},

	INFO: () => {
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

	ALREADY_ACCEPTED_MATCH: () => {
		return 'You have already accepted the match, I know you are eager to play, but *hey*, calm down.';
	},

	MATCH_ACCEPTED: () => {
		return 'You accepted the match!\n Enter \/match to view match details\n\n⚽⚽⚽';
	},

	MATCH_REJECTED: () => {
		return 'You rejected the match! Enter \/request if you change your mind';
	},

	MATCH_MAX_NUMBER: () => {
		return '😕 Sorry, there is no place left for you this match, Use command /list to view current players';
	},

	NO_ACTIVE_MATCH: () => {
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

module.exports = Msg;