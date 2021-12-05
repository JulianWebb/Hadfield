---
layout: page
title: caps.txt
weight: 1
lastUpdated: 2021-11-05
---

`caps.txt` is an extension to the Gopher Protocol and a special configuration file requested by some Gopher Clients (notably the FloodGap Proxy) that is used to list server capabilities, configuration, and metadata. It offers some overlap with Gopher+ functionality without requiring new syntax. As it is an extension, it is not mandatory to use and any client that fails without it's existence is broken.

Hadfield implements `caps.txt` through it's `configuration.toml` in the table `gopher.capabilities`. 

## Properties
Suggested properties include:

key | description | suggested
--- | --- | 
`CapsVersion` | version of caps specification used | `1`
`ExpireCapsAfter` | how long to wait before fetching `caps.txt` again (in seconds) | `3600`
`ServerAdmin` | email address for the system admin | your email

Note: this is a subset of values that may be used, an example with more entries can be found on the floodgap gopherhole, however those options may not work properly with Hadfield

## References
* [Floodgap caps.txt](gopher://floodgap.com/0/caps.txt)
