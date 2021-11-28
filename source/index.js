// index.js
const Path = require('path');

const Gopher = require('./gopher');
const configuration = require('./configuration')();

async function Hadfield() {
	const gopher = await Gopher({
		documentRoot: Path.join(process.cwd(), configuration.gopher.documentRoot),
		host: configuration.server.host,
		port: configuration.server.port
	})

	gopher.listen()
		.then(() => {
			const URL = `${configuration.server.host || "0.0.0.0"}:${configuration.server.port}`;
			console.log(`Server listening on gopher://${URL}/`);
		});
}

Hadfield();