# Hadfield

Hadfield is a Document-Based Gopher Server written in Javascript utilizing NodeJS.

*Note: Hadfield is still under heavy development, until version 1.0 expect breaking changes*

## What *is* Gopher?

Gopher is a Document Retrival Protocol designed in 1991 (pre-HTTP) for faciliatiing the distrubtion of information to clients using stateless connnections.

[Gopher on Wikipedia](https://en.wikipedia.org/wiki/Gopher_(protocol))   
[The Internet Gopher Protocol - RFC1436](https://datatracker.ietf.org/doc/html/rfc1436#section-7)

## Using Hadfield

Hadfield uses a toml configuration file, by default it looks for it in the following places:
* `configuration.toml` at path specificed by environment variable `CONFIGURATION_PATH`
* `configuration.toml` at the current working directory 

### Configuration
The configuration currently utilitizes two top level tables (`server` and `gopher`). Within `gopher` it also uses the table `capabilites`.

#### Server Table
key | value | required | default
--- | --- | --- | ---
"host" | the host to bind the socket to | *false* | `0.0.0.0`
"port" | the port to bind the socket to | *false* | `70`

#### Gopher Table
key | value | required | default
--- | --- | --- | ---
"documentRoot" | The location of the documents* | **true**
"assetRoot" | The location of the non-document files* | **true**

<sup>*\*note: these values are relative to the current working directory*</sup>

##### Capabilities Table
The keyvalue pairs of this table are whatever you wish to send in your `caps.txt` file to clients that support that

### Document JSON

Todo: Explain

### Running the project

Simply use the command `npm start` to run Hadfield

## License
See License in [LICENSE](LICENSE)
