function MenuWrapper() {
	class Menu {
		constructor(entries, host, port, newline, separator) {
			this.entries = entries;
			this.host = host;
			this.port = port;
			this.newline = newline || "\r\n";
			this.separator = separator || "\t";
		}

		get suffix() {
			return this.host + this.separator + this.port + this.newline;
		}

		get stringify() {
			if (!this.generatedString) {
				this.generatedString = this.entries.sort((scooby, shaggy) => {
					if (scooby.weight < shaggy.weight) return -1;
					if (shaggy.weight > scooby.weight) return 1;
					return 0;
				}).reduce((accumulator, current) => accumulator + current + this.suffix, "");
			}

			return this.generatedString;
		}
	}

	Menu.prototype.toString = function() { return this.stringify; };

	return Menu;
}

module.exports = MenuWrapper();