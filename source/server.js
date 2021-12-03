const { createServer } = require("net");
const { EventEmitter } = require("stream");

async function SocketManagerConstructor(configuration) {
	return new SocketManager(configuration);
}

class SocketManager extends EventEmitter {
	constructor(configuration) {
		super();

		this.configuration = configuration;

		this.server = createServer(socket => {
			const socketHandler = new SocketHandler(socket);

			socketHandler.socket.once("data", data => {
				const message = stripNewlines(data).toString('ascii') || "";

				this.emit("message", message, socketHandler);
				return void 0;
			});

			socketHandler.socket.on("error", error => {
				console.log('Socket Error: ', error.toString());
			})
		})
	}

	async listen(host, port) {
		if (arguments.length == 1) {
			port = host;
			host = undefined;
		}

		port = port? port: this.configuration.port;
		host = host? host: this.configuration.host;

		return new Promise((resolve, reject) => {
			try {
				if (host) {
					this.server.listen(port, host, resolve);
				} else {
					this.server.listen(port, resolve);
				}
			} catch (exception) {
				reject(exception);
			}
		});
		
	}
}

function SocketHandler(socket) {
	this.socket = socket;
	
	this.write = function(message) {
		return new Promise((resolve, _) => {
			if (Array.isArray(message)) {
				message = message.reduce((accumulator, current) => {
					return accumulator + current;
				}, "")
			} else {
				message = message.toString();
			}

			this.socket.write(message, 'ascii', resolve(this));
		});
	}

	this.end = function(message = "") {
		return new Promise((resolve, _) => {
			this.socket.end(message, "ascii", () => {
				resolve(this.socket.destroy());
			});
		});
	}
}

function stripNewlines(messageBuffer) {
	if (!messageBuffer) return messageBuffer;
	let message = messageBuffer.toString("ascii");

	if (message.endsWith(`\r\n`)) {
		return messageBuffer.slice(0, -2);
	} else if (message.endsWith(`\n`)) {
		return messageBuffer.slice(0, -1);
	}

	return messageBuffer;
}

module.exports = SocketManagerConstructor;