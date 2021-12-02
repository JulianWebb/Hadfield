const { createServer } = require("net");
const { EventEmitter } = require("stream");

const NEWLINE_RN = Buffer.from('\r\n');
const NEWLINE_N  = Buffer.from('\n');

async function SocketManagerConstructor(configuration) {
	return new SocketManager(configuration);
}

class SocketManager extends EventEmitter {
	constructor(configuration) {
		super();
		this.configuration = configuration;
		this.server = createServer(socket => {
			const socketHandler = new SocketHandler(socket);
			socketHandler.socket.on("data", data => {
				let message;
				if (data.equals(NEWLINE_RN) || data.equals(NEWLINE_N)) {
					message = null;
				}

				if (data.slice(-2).equals(NEWLINE_RN)) {
					message = data.slice(0, -2).toString("ascii");
				} else if (data.slice(-1).equals(NEWLINE_N)) {
					message = data.slice(0, -1).toString("ascii");
				}

				return this.emit("message", message, socketHandler);
			});

			socketHandler.socket.on("error", error => {
				console.log('Socket Error: ', error.toString());
			})
		})
	}

	async listen(port) {
		port = port? port: this.configuration.port;
		return new Promise((resolve, reject) => {
			if (this.configuration.host) {
				this.server.listen(port, this.configuration.host, resolve);
			} else {
				return this.server.listen(port, resolve);
			}
		})
		
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

module.exports = SocketManagerConstructor;