'use strict';

const
	App = require('./app'),
	Poll = require('./service/poll');

// Start web App
new App().start();

// Start Polling
new Poll().start();
