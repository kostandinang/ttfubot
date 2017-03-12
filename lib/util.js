'use strict';

const
	Moment = require('moment');

const TIME_FORMAT = 'MM-DD-YYYY HH:mm:ss';

module.exports = {

	getDateFromTS: (date) => {
		return new Date(date * 1000);
	},

	getFormattedDate: (date) => {
		return Moment(date).format(TIME_FORMAT);
	}
}