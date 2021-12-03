const Path = require("path");

function EntryWrapper() {
	class Entry {
		constructor(properties, attributes, selectorPath, newline, separator) {
			this.properties = properties;
			this.attributes = attributes;
			this.selectorPath = selectorPath;
			this.newline = newline || "\r\n";
			this.separator = separator || "\t";
		}
		
		get type() {
			return this.properties.type;
		}

		get description() {
			return this.properties.description;
		}

		get selector() {
			return this.properties.selector?
				Path.join(this.selectorPath, this.properties.selector): "";
		}

		get weight() {
			return this.properties.weight || 0;
		}

		get stringify() {
			if (!this.generatedString) {
				this.generatedString = 
					this.type + 
					this.description + 
					this.separator + 
					this.selector +
					this.separator;
			}

			return this.generatedString;
		}
	}

	Entry.prototype.toString = function() { return this.stringify; };

	return Entry;
}

module.exports = EntryWrapper();