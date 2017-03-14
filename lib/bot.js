'use strict';

const
	Promise = require('bluebird'),
	Http = require('./http'),
	Config = require('../config');

const URL = 'https://api.telegram.org/bot' + Config.TELEGRAM_BOT_TOKEN

/**
 * Get Bot Details
 */
function getMe() {

	return new Promise((resolve, reject) => {
		Http.get(URL + '/getMe').then(result => {
			resolve(result);
		}).catch(err => {
			reject(err);
		})
	});
}

/**
 * Get Bot updates
 */
function getUpdates(offset) {

	return new Promise((resolve, reject) => {
		Http.get(URL + '/getUpdates', {
			params: {
				offset: offset
			}
		}).then(result => {
			resolve(result);
		}).catch(err => {
			reject(err);
		})
	});
}

function sendMessage(id, message, opts) {

	return new Promise((resolve, reject) => {
		let params = {
			chat_id: id,
			text: message,
			parse_mode: 'Markdown'
		};
		if (opts && opts.markup) {
			params.reply_markup = opts.markup;
		}
		Http.post(URL + '/sendMessage', params).then(result => {
			resolve(result);
		}).catch(err => {
			reject(err);
		})
	})
}

module.exports = {
	getMe: getMe,
	getUpdates: getUpdates,
	sendMessage: sendMessage
}