'use strict';

const
	Config = require('../config');

module.exports = {
	
	render: (reply, template, data) => {
		reply.view(template, {
			data: data,
		})
	},

	renderError: (reply, error) => {
		reply.view('error', {
			error: error
		})		
	}
}