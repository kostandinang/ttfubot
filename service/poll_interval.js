'use strict';

const
	Config = require('../config');

module.exports = class PollInterval {

	constructor(exec) {
		this.exec = exec;
		this.interval = null;
	}

	start() {
		this.interval = setInterval(this.exec, Config.POLL_INTERVAL);
	}

	stop() {
		clearInterval(this.interval);
	}
}