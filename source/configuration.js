const Filesystem = require('fs');
const Path = require('path');
require('toml-require').install();

const defaultConfiguration = {
	server: {
		port: 70,
		newline: '\r\n'
	}
}

function configurationPath(argumentPath) {
	if (argumentPath) return argumentPath;
	if (process.env.CONFIGURATION_PATH) return process.env.CONFIGURATION_PATH;
	return Path.join(process.cwd(), 'configuration.toml');
}

function ConfigurationConstructor(userConfigurationPath) {
	userConfigurationPath = configurationPath(userConfigurationPath);
	if (!Filesystem.existsSync(userConfigurationPath)) {
		console.log('No user configuration found, using defaults');
		return defaultConfiguration;
	}

	const userConfiguration = require(userConfigurationPath);
	console.log(`User configuration loaded from: ${userConfigurationPath}`);
	return {
		gopher: {
			...defaultConfiguration.gopher,
			...userConfiguration.gopher
		},
		server: {
			...defaultConfiguration.server,
			...userConfiguration.server
		}
	}
}

module.exports = ConfigurationConstructor;