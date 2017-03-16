'use strict';

const
	Config = require('../config'),
	Moment = require('moment');

const TIME_FORMAT = 'MM-DD-YYYY HH:mm:ss';

module.exports = {

	getDateFromTS: (date) => {
		return new Date(date * 1000);
	},

	getFormattedDate: (date) => {
		return Moment(date).format(TIME_FORMAT);
	},

	getCacheKey: (key) => {
		return key.substring(Config.REDIS_KEY_PREFIX.length + 1, key.length);
	}
}