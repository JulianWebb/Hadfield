// index.js
const Gopher = require('./gopher');
const configuration = require('./configuration')();

async function Hadfield() {
	const gopher = await Gopher(configuration);

	gopher.listen()
		.then(() => {
			const URL = `${configuration.server.host || "0.0.0.0"}:${configuration.server.port}`;
			console.log(`Server listening on gopher://${URL}/`);
		});
}

Hadfield();