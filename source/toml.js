const Filesystem = require('fs');
const TOML = require('@flourd/toml');

module.exports = {
	loadTOML: (filePath) => {
		try {
			const TOMLfile = Filesystem.readFileSync(filePath);
			const parsedTOML = TOML.parse(TOMLfile);
			return parsedTOML;
		} catch (exception) {
			throw exception;
		}
	}
};