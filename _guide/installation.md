---
layout: page
title: Installation
weight: 1
lastUpdated: 2021-11-04
---

Hadfield uses GitHub workflows to generate a new Docker image every time the main branch is updated in the git repository. The Docker image is the recommended and official method of using Hadfield.

{% include toc.html %}

## Configuration

Hadfield looks for a TOML configuration file at the path provided by `CONFIGURATION_PATH` and if it cannot find one then for a `configuration.toml` in the working directory.

The following is a regular subset of configuration options available:

**key** | **description** | **required** | **default**
--- | --- | --- | ---
`server.host` | The address for the server to bind to | *false* | All available
`server.port` | The port for the server to bind to | *false* | `7000`
`gopher.host` | The address to display on menu entries | *false* | The value of `server.host`
`gopher.server` | The port to display on menu entries | *false* | The value of `server.port`
`gopher.documentRoot` | The path of the TOML document directory* | **true**
`gopher.assetRoot` | The location of the non-document file directory* | **true**
`gopher.capabilites.*` | Properties for `caps.txt` | *false*

<sup>*note: these values are relative to the working directory</sup>

An example `configuration.toml` might look like:   
```toml
[server]
	port = 70
[gopher]
	host = "julianwebb.ca"
	port = 70
	documentRoot = "data/documents"
	assetRoot = "data/assets"
	[gopher.capabilites]
		ServerName = "Julian's Server"
```

for per document configuration see [Usage](/usage/)

## Docker

Hadfield can be run via the following command:

`docker run -p 70:7000 -e CONFIGURATION_PATH=/app/data/configuration.toml -v ${PWD}/data:/app/data ghcr.io/julianwebb/hadfield`

By default Hadfield uses port `7000` and listens on every available address.

See the previous section for information on configuration

## Docker Compose

Example Docker Compose:
```yml
version: "3"

services:
  hadfield:
    image: ghcr.io/julianwebb/hadfield
    ports:
      - "70:7000"
    environment:
      CONFIGURATION_PATH: "/app/data/configuration.toml"
    volumes:
      - "./data:/app/data"
    restart: "unless-stopped"
```

