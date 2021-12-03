const Path = require('path');
const Server = require('./server');
const Catalogue = require('./catalogue');

async function GopherConstructor(configuration) {
	const catalogue = await Catalogue(
		Path.join(process.cwd(), configuration.gopher.documentRoot),
		Path.join(process.cwd(), configuration.gopher.assetRoot), 
		configuration.gopher.host || configuration.server.host,
		configuration.gopher.port || configuration.server.port,
		configuration.gopher.newline || '\r\n',
		configuration.gopher.separator || '\t'
	);

	const server = await Server({
		host: configuration.server.host,
		port: configuration.server.port,
	});

	return new Gopher(configuration, catalogue, server);
}

class Gopher {
	constructor (configuration, catalogue, server) {
		this.configuration = configuration;
		this.capabilities = configuration.capabilities;
		this.catalogue = catalogue;
		this.server = server;
		this.server.on('message', this.serve.bind(this));
	}
	
	error(message) {
		const host = this.configuration.gopher.host || this.configuration.server.host;
		const port = this.configuration.gopher.port || this.configuration.server.port;
		return `3${message}\t\t${host}\t${port}\r\n.\r\n`;
	}

	serve(message, socket) {
		console.log(`Incoming message: `, message);
		if (message.includes('\t')) {
			socket.socket.end(this.error('Gopher+ not implemented'), () => {
				socket.socket.destroy();
			});
			return void 0;
		}

		let response;
		if (message == "caps.txt") {
			for (const key in this.capabilities) {
				response += key + this.capabilities[key].toString() + "\r\n";
			}
		} else {
			message = message == ""? "/": message;
			response = this.catalogue.query(message);
		}

		socket.socket.end(response, () => {
			socket.socket.destroy();
		});
	}

	async listen() {
		return await this.server.listen();
	}
}

module.exports = GopherConstructor;