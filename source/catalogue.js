const Filesystem = require('fs');
const Path = require('path');

const Types = require('./types');

const TAB = "	";
const NEWLINE = "\r\n";

async function CatalogueConstructor(configuration) {
	const catalogue = new Catalogue({
		documentRoot: configuration.documentRoot,
		host: configuration.host,
		port: configuration.port
	});

	catalogue.populate(catalogue.documentRoot);

	return catalogue;
};

class Document {
	constructor(properties, root) {
		this.properties = properties;
		this.root = root;
	}

	get type() {
		return this.properties.type;
	}

	get description() {
		return this.properties.description;
	}

	get entry() {
		if (!this.generatedEntry) {
			const selector = this.properties.selector? 
			Path.join(this.root, this.properties.selector):
			"";

			switch (this.type) {
				case Types.TextFile:
				case Types.Directory:
				case Types.Information:
					this.generatedEntry = this.type + this.description + TAB + selector + TAB;
					break;
				default:
					this.generatedEntry = Types.ErrorCondition + "This Entry Type is not implemented" + TAB + "Err" + TAB;
			}
		}

		return this.generatedEntry;
	}
}

class Menu {
	constructor(host, port) {
		this.host = host;
		this.port = port;
		this.entries = {};
		this.end = this.host + TAB + this.port + NEWLINE;
	}

	addEntry(name, document) {
		this.entries[name] = document;
	}

	get display() {
		if (!this.generatedDisplay) {
			this.generatedDisplay = Object.keys(this.entries)
				.sort((scooby, shaggy) => {
					const scoobyWeight = this.entries[scooby].weight || 0;
					const shaggyWeight = this.entries[shaggy].weight || 0;

					const rawDifference = shaggyWeight - scoobyWeight;
					const clampedDifference = Math.min(Math.max(rawDifference, -1, 1));
					return clampedDifference;
				}).reduce((accumulator, current) => {
					return accumulator + this.entries[current].entry + this.end;
				}, "");
		}

		return this.generatedDisplay;
	}
}

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
			this.entries[gopherPath].addEntry(name, new Document(properties, gopherPath));

			if (properties.type == Types.Directory) {
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
		console.log(typeof selectorMinusOne);
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

		return {
			type: item.type,
			item
		}

	}
}

module.exports = CatalogueConstructor;
