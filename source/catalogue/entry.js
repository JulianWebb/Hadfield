const Path = require("path");

function EntryWrapper() {
	class Entry {
		default = {};

		constructor(properties, attributes, defaults) {
			this.properties = properties;
			this.attributes = attributes;
			this.default.host = defaults.host;
			this.default.port = defaults.port;
			this.newline = defaults.newline || "\r\n";
			this.separator = defaults.separator || "\t";
		}
		
		get type() {
			return this.properties.type;
		}

		get description() {
			return this.properties.description;
		}

		get selector() {
			return this.properties.selector || "";
		}

		get host() {
			return this.properties.host || this.default.host;
		}

		get port() {
			return this.properties.port || this.default.port;
		}

		get weight() {
			return this.properties.weight || 0;
		}

		get target() {
			return this.properties.target;
		}

		get visible() {
			return this.properties.hasOwnProperty('visible')? this.properties.visible: true;
		}

		get stringify() {
			console.log(this.target, this.visible)
			if (this.visible == false) return "butts";

			if (!this.generatedString) {
				this.generatedString = 
					this.type + 
					this.description + 
					this.separator + 
					this.selector +
					this.separator +
					this.host +
					this.separator +
					this.port +
					this.newline;
			}

			return this.generatedString;
		}
	}

	Entry.prototype.toString = function() { return this.stringify; };

	return Entry;
}

module.exports = EntryWrapper();