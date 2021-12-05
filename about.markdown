---
layout: page
title: About
permalink: /about/
lastUpdated: 2021-11-04
---

Hadfield is written in CommonJS, utilizing the NodeJSv16 runtime. It uses TOML configuration files for it's configuration and data structure.

It is currently in a pre-1.0 phase, so thing are likely to change in it's implementation. Attempts will be made to keep this documentation up to date but until a stable release it's possible that this site will have incorrect info.

Currently Hadfield implements the Gopher protocol as outlined in [RFC1436](https://datatracker.ietf.org/doc/rfc1436/). It does not have Gopher+ support or any other extensions. It is intended that Hadfield supports Gopher+ by v1.0, see the [Project Board](https://github.com/JulianWebb/Hadfield/projects/1) on GitHub to see the status.

The current design tightly couples the server implementation with the handling of documents and directories. Due to the limited nature of Gopher this does not seem like an issue. Future designs may allow for different document handling schemes to be used at the system administrator's discretion.

TOML was chosen over YAML or JSON due to it's less strict nature and the interest to keep it distinct from the configuration and language used elsewhere in the project.

