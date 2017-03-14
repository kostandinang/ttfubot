'use strict';

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