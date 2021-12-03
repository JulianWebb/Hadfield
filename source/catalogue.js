const Filesystem = require('fs');
const Path = require('path');
const { loadTOML } = require('./toml');

const EntryTypes = require('./types/entryTypes');

const Entry = require('./catalogue/entry');
const Menu = require('./catalogue/menu');

async function CatalogueConstructor(configuration) {
	const catalogue = new Catalogue({
		documentRoot: configuration.documentRoot,
		host: configuration.host,
		port: configuration.port
	});

	catalogue.populate(catalogue.documentRoot);

	return catalogue;
};

class Catalogue {
	constructor(configuration) {
		this.documentRoot = configuration.documentRoot;
		this.host = configuration.host;
		this.port = configuration.port;
		this.entries = {};
	}

	addEntry(path, menu) {
		this.entries[path] = menu;
	}

	populate(directory, gopherPath = "/") {
		const entries = Filesystem.readdirSync(directory, { withFileTypes: true });
		this.addEntry(gopherPath, new Menu(this.host, this.port));

		for (const entry of entries) {
			if (!entry.name.endsWith('.json')) continue;

			const [ name ] = entry.name.split('.');
			const properties = require(Path.join(directory, entry.name));
			this.entries[gopherPath].addEntry(name, new Entry(properties, gopherPath));

			if (properties.type == EntryTypes.Directory) {
				const childDirectory = Path.join(directory, properties.directory);
				const childGopherPath = Path.join(gopherPath, properties.directory);
				this.populate(childDirectory, childGopherPath);
			}
		}
	}

	getItem(selector) {
		if (selector == "") {
			return {
				type: "menu",
				item: this.entries["/"]
			};
		}
		if (this.entries[selector]) {
			return {
				type: "menu",
				item: this.entries[selector]
			};
		}

		const selectorMinusOne = selector.substring(0, selector.lastIndexOf("/")) || "/";

		if (!this.entries[selectorMinusOne]) {
			return {
				type: "failure",
				item: {
					description: "Nothing found for selector"
				}
			};
		}

		const itemName = selector.substring(selector.lastIndexOf("/") + 1);
		const item = this.entries[selectorMinusOne].entries[itemName];
		if (item) {
			return {
				type: item.type,
				item
			}
		}

		return {
				type: "failure",
				item: {
					description: "Nothing found for selector"
				}
			};

	}
}

module.exports = CatalogueConstructor;
