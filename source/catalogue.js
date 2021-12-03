const Filesystem = require('fs');
const Path = require('path');
const { loadTOML } = require('./toml');

const EntryTypes = require('./types/entryTypes');

const Menu = require('./catalogue/menu');
const Entry = require('./catalogue/entry');

async function CatalogueConstructor(rootDirectory, assetDirectory, host, port, newline, separator) {
	const catalogue = new Catalogue(rootDirectory, assetDirectory, host, port, newline, separator);
	
	return catalogue;
}

class Catalogue {
	selectors = {
		'/': {
			type: EntryTypes.Directory,
			selector: "/"
		}
	};
	menus = {};

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

		let menuEntries = [];
		const directoryEntries = Filesystem.readdirSync(directory, { withFileTypes: true });
		for (const directoryEntry of directoryEntries) {
			if (!directoryEntry.name.endsWith('.entry.toml')) continue;
			const entryTOML = loadTOML(Path.join(directory, directoryEntry.name));
			const entry = new Entry(entryTOML.properties, entryTOML.attributes, gopherPath, this.newline, this.separator);
			menuEntries.push(entry);
			if (entryTOML.properties.selector) {
				this.selectors[entry.selector] = entry;
			}

			if (entry.type == EntryTypes.Directory) {
				const childDirectory = Path.join(directory, entryTOML.properties.target);
				this.populate(childDirectory, entry.selector);
			}
		}

		this.menus[gopherPath] = new Menu(menuEntries, this.host, this.port, this.newline, this.separator);
	}

	query(userSelection) {
		if (!this.selectors[userSelection]) return this.error + this.lastLine;
		const selection = this.selectors[userSelection];
		switch (selection.type) {
			case EntryTypes.TextFile:
				return Filesystem.readFileSync(Path.join(this.assetDirectory, selection.properties.target), "ascii") + this.lastLine;
			case EntryTypes.Directory:
				return this.menus[selection.selector].toString() + this.lastLine;
			default:
				return this.error + this.lastLine;
		}
	}
}

module.exports = CatalogueConstructor;
