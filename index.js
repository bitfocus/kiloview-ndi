/*
	Author: Håkon Nessjøen <haakon@bitfocus.io>
	Copyright Bitfocus AS, 2020
*/
const axios = require('axios');

class kiloviewNDI {
	connection_info = {
		ip: '',
		username: '',
		password: ''
	};

	session = {
		token: '',
		session: ''
	}

	constructor(ip, username, password) {
		this.connection_info = {
			ip,
			username,
			password
		}

		this.client = axios.create({
			baseURL: 'http://' + ip + '/api/v1'
		});
	}

	async authorize() {
		const { username, password } = this.connection_info;

		const result = await this.client.post('/user/authorize', { username, password });

		if (result.data && result.data.result === 'error') {
			let error = new Error(result.data.msg);
			error.name = 'KiloviewNDIError';
			throw error;
		}

		this.session = {
			token: result.data.data.token,
			session: result.data.data.session
		}

		this.authClient = axios.create({
			baseURL: 'http://' + this.connection_info.ip + '/api/v1',
			headers: {
				'API-Session': this.session.session,
				'API-Token': this.session.token
			}
		});

		return true;
	}

	async authPost(...args) {
		if (this.authClient === undefined) {
			await this.authorize();
		}

		let result = await this.authClient.post(...args);
		if (result && result.data && result.data.result === 'auth-failed') {
			// Try to reauthorize, will fail out if not ok
			await this.authorize();
		} else {
			if (result.data && result.data.result === 'error') {
				let error = new Error(result.data.msg);
				error.name = 'KiloviewNDIError';
				throw error;
			}

			return result && result.data && (result.data.data || result.data.result);
		}

		// Try second time
		result = await this.authClient.post(...args);

		if (result.data && result.data.result === 'error') {
			let error = new Error(result.data.msg);
			error.name = 'KiloviewNDIError';
			throw error;
		}

		return result && result.data && (result.data.data || result.data.result)
	}

	modeGet() {
		return this.authPost('/mode/get');
	}

	/*
		mode: encoder | decoder
	*/
	modeSwitch(mode) {
		return this.authPost('/mode/switch', { mode });
	}

	modeStatus() {
		return this.authPost('/mode/status');
	}

	decoderDiscoveryGet() {
		return this.authPost('/decoder/discovery/get');
	}

	decoderCurrentStatus() {
		return this.authPost('/decoder/current/status');
	}

	decoderCurrentSetPreset(id) {
		return this.authPost('/decoder/current/set', { id });
	}

	decoderCurrentSetUrl(name, url) {
		return this.authPost('/decoder/current/set', { name, url });
	}

	// color: #aabbcc with #
	decoderPresetSetBlank(color) {
		return this.authPost('/decoder/preset/set_blank', { color });
	}

	encoderNdiStatus() {
		return this.authPost('/encoder/ndi/status');
	}

	encoderNdiGetConfig() {
		return this.authPost('/encoder/ndi/get_config');
	}

	/*
		{
			device_group: string, // optional
			device_name: string, // optional
			ndi_connection: 'tcp' | 'multicast', // optional
			netprefx: string, // multicast address and subnetmask in pair
			quality: int, // optional, 75-100
		}
	*/
	encoderNdiSetConfig(config) {
		return this.authPost('/encoder/ndi/set_config', config);
	}

	sysServerInfo() {
		return this.authPost('/sys/server_info');
	}

	sysReconnect() {
		return this.authPost('/sys/reconnect');
	}

	sysReboot() {
		return this.authPost('/sys/reboot');
	}

	sysRestore() {
		return this.authPost('/sys/restore');
	}
}

module.exports = kiloviewNDI;