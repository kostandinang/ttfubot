'use strict';

const
	Hapi = require('hapi'),
	Vision = require('vision'),
	Config = require('./config');

const Server = new Hapi.Server();
const Routes = require('./routes');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

module.exports = class App {

	contructor() { }

	/**
	 * Start Web App
	 */
	start() {

		Server.connection({
			host: HOST,
			port: PORT
		})

		Server.register(
			Vision, err => {
				if (err) console.error('Failed to load Vision');
				Server.views({
					engines: { pug: require('pug') },
					path: __dirname + '/templates',
					compileOptions: {
						pretty: true
					},
					context: Config.Context
				});
			}
		)

		Server.start(err => {
			if (err) {
				throw err;
			} else {
				console.log('TTFUBot Server is running @' + PORT);
				new Routes(Server);
			}
		})
	}
}