const Filesystem = require('fs');
const Path = require('path');
const { loadTOML } = require('./toml');

const EntryTypes = require('./types/entryTypes');

const Entry = require('./catalogue/entry');

async function CatalogueConstructor(rootDirectory, assetDirectory, host, port, newline, separator) {
	const catalogue = new Catalogue(rootDirectory, assetDirectory, host, port, newline, separator);
	
	return catalogue;
}

class Catalogue {
	selectors = {
		'/': {
			type: EntryTypes.Directory,
			target: "/"
		}
	};
	menuList = {};

	constructor(rootDirectory, assetDirectory, host, port, newline, separator) {
		this.rootDirectory = rootDirectory;
		this.assetDirectory = assetDirectory;
		this.host = host;
		this.port = port;
		this.newline = newline || "\r\n";
		this.separator = separator || "\t";
		this.populate();
	}

	get suffix() {
		return this.host + this.separator + this.port + this.newline;
	}

	get lastLine() {
		return '.' + this.newline;
	}
	get error() {
		return `3Sorry nothing found for that selector` + this.separator + this.suffix;
	}

	populate(directory, gopherPath) {
		directory = directory || this.rootDirectory;
		gopherPath = gopherPath || "/";

		this.menuList[gopherPath] = [];

		const directoryEntries = Filesystem.readdirSync(directory, { withFileTypes: true });

		for (const directoryEntry of directoryEntries) {
			if (!directoryEntry.name.endsWith('.entry.toml')) continue;

			const entryTOML = loadTOML(Path.join(directory, directoryEntry.name));
			const entry = new Entry(entryTOML.properties, entryTOML.attributes, { host: this.host, port: this.port, newline: this.newline, separator: this.separator });
			this.menuList[gopherPath].push(entry);

			if (entryTOML.properties.selector) {
				this.selectors[entry.selector] = entry;
			}

			if (entry.type == EntryTypes.Directory) {
				if (this.menuList[entry.target]) continue;
				const childDirectory = Path.join(this.rootDirectory, entry.target);
				this.populate(childDirectory, entry.target);
			}
		}
	}

	query(userSelection) {
		if (!this.selectors[userSelection]) return this.error + this.lastLine;
		const selection = this.selectors[userSelection];
		
		switch (selection.type) {
			case EntryTypes.TextFile:
				return Filesystem.readFileSync(Path.join(this.assetDirectory, selection.target), "ascii") + this.newline + this.lastLine;
			case EntryTypes.Directory:
				const message = this.menuList[selection.target].sort((scooby, shaggy) => {
						if (scooby.weight < shaggy.weight) return -1;
						if (shaggy.weight > scooby.weight) return 1;
						return 0;
					}).reduce((accumulator, current) => accumulator + current, "");
				return message + this.lastLine;
			default:
				return this.error + this.lastLine;
		}
	}

	selectorExists(userSelection) {
		return !!this.selectors[userSelection];
	}
}

module.exports = CatalogueConstructor;
