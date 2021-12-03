class Menu {
	constructor(host, port) {
		this.host = host;
		this.port = port;
		this.entries = {};
		this.end = this.host + "\t" + this.port + "\r\n";
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

module.exports = Menu;