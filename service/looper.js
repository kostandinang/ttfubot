'use strict';

const
	Config = require('../config');

module.exports = class PollInterval {

	constructor(exec, duration) {
		this.exec = exec;
		this.interval = null;
		this.duration = duration;
	}

	start() {
		this.interval = setInterval(this.exec, this.duration);
	}

	stop() {
		clearInterval(this.interval);
	}
}