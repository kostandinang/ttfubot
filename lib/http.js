'use strict';

const
	Axios = require('axios'),
	Promise = require('bluebird');

module.exports = {

	/**
	 * Performs a get request
	 */
	get: (url, opts) => {

		return new Promise((resolve, reject) => {
			Axios.get(url, opts).then(res => {
				if (res.status == 200 && res.data.ok) {
					resolve(res.data.result);
				} else {
					reject(res);
				}
			}).catch(err => {
				reject(err);
			})
		})
	},

	post: (url, opts) => {

		return new Promise((resolve, reject) => {
			Axios.post(url, opts).then(res => {
				if (res.status == 200 && res.data.ok) {
					resolve(res.data.result);
				} else {
					reject(res);
				}
			}).catch(err => {
				reject(err);
			})
		})
	}

}