const Filesystem = require('fs');
const Path = require('path');
const Server = require('./server');
const Catalogue = require('./catalogue');
const Types = require('./types');

async function GopherConstructor(configuration) {
	const catalogue = await Catalogue({
		documentRoot: configuration.documentRoot,
		host: configuration.host,
		port: configuration.port
	});

	const server = await Server({
		host: configuration.host,
		port: configuration.port,
		assetRoot: configuration.assetRoot
	});
	const gopher = new Gopher(configuration, catalogue, server);

	return gopher;
}

class Gopher {
	constructor (configuration, catalogue, server) {
		this.configuration = configuration;
		this.capabilities = configuration.capabilities;
		this.catalogue = catalogue;
		this.server = server;
		this.server.on('message', this.serve.bind(this));
	}
	
	serve(message, socket) {
		console.log(`Incoming message: `, message);
		if (message == "caps.txt") {
			let response;
			for (const key in this.capabilities) {
				response += key + this.capabilities[key].toString() + "\r\n";
			}
			socket.write(response)
				.then(socket => {})//socket.end());
		}

		if (message.startsWith("\u0009")) {
			this.reply(`3GopherPlus not current implemented	Err	${this.host}	${this.port}`, socket);
			return void 0;
		}

		const { type, item } = this.catalogue.getItem(message);
		switch (type) {
			case "failure":
				this.reply(`3${item.description}	Err	${this.host}	${this.port}\r\n`, socket);
				break;
			case "menu":
				this.reply(item.display, socket);
				break;
			case Types.TextFile:
				let text = Filesystem.readFileSync(Path.join(this.configuration.assetRoot, item.properties.file), "utf-8");
				this.reply(text + "\r\n", socket);
				break;
			default:
				this.reply(item.entry, socket);
				break;
		}
	}

	reply(message, socket) {
		socket.write(message).then(() => {
			socket.end('.');
		})
	}

	async listen() {
		return await this.server.listen();
	}
}

module.exports = GopherConstructor;