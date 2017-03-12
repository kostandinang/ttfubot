'use strict';

const
	Runner = require('./service/runner'),
	Poll = require('./service/poll');

let poll = new Poll();
poll.start();

//Runner.exec();