class Entry {
	constructor(properties, root, seperator = '\t') {
		this.properties = properties;
		this.root = root;
		this.seperator = seperator;
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
					this.generatedEntry = this.type + this.description + this.seperator + selector + this.seperator;
					break;
				default:
					this.generatedEntry = Types.ErrorCondition + "This Entry Type is not implemented" + this.seperator + "Err" + this.seperator;
			}
		}

		return this.generatedEntry;
	}
}

module.exports = Entry;