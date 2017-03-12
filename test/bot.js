'use strict';

const
	Chai = require('chai'),
	Mocha = require('mocha'),
	Bot = require('../lib/bot'),
	Config = require('../config');

const
	expect = Chai.expect;

describe('Bot actions', () => {

	/**
	 * Get my bot details
	 */
	it('Should get me', (done) => {
		Bot.getMe().then(result => {
			expect(result.username).to.equal(Config.BOT_USERNAME);
			done();
		}).catch(err => {
			done(err);
		})
	})

	/**
	 * Get bot updates
	 */
	it('Should get updates', (done) => {
		Bot.getUpdates().then(result => {
			console.log('Result: ' + JSON.stringify(result));
			expect(result).to.not.be.null.and;
			done();
		}).catch(err => {
			done(err);
		})
	})
})