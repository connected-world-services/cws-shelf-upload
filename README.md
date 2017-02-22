cws-shelf-upload
================

[Shelf] is a generic API and making something generic means that it can be complicated to work with. This tool is aimed at norrowing down how Shelf is used specifically for Connected World Services.


[![npm version][npm-badge]][npm-link]
[![Dependencies][dependencies-badge]][dependencies-link]

Overview
--------

Right now our official upload tool is curl which can be difficult to use even for people familiar with it. This tool was created as stop gap for a full UI. It is an improvement in the following ways:

* No need to type in host and protocol.
* No need to think about the path you want to upload an artifact in. We just require you to provide `--shelf` and `--component` and the file you are uploading.
* Automatically ensure the path is unqiue so there are no conflicts.
* Forces `--version` to be provided so that downstream systems can rely on it being there.
* Provides a more shell friendly format for metadata. No need to enter JSON.

There are however many things this tool does NOT do:

* Searching.
* Create/Read/Update/Delete metadata when an artifact is not being uploaded.


Example
-------

For full information on the tool use the `--help` option. The following is an example of uploading a new code base for the "cws-api" to the "cws" product. I also want to add a `buildNumber` to my new artifact.

Note: `--shelf` is what some would refer to as a "bucket" or "storage".

    $ export SHELF_AUTH_TOKEN="supersecrettoken"
    $ cws-shelf-upload --shelf="cws" --component="cws-api" --version=1.0.0 --immutable=buildNumber:4 cws-api.gz.tar
    Successfully uploaded artifacts.
    https://api.shelf.cwscloud.net/cws/artifact/cws-api/2017-02-17T1558:29.397Z-5jHodx2U3J/cws-api.gz.tar
    Done
    $

You can use the full URI given back to perform other [Shelf] queries.


Installation
------------

Use `npm` to install this tool.

    $ sudo npm install -g cws-shelf-upload


License
-------

This software is distributed under a [modified MIT license][LICENSE] with clauses covering patents. [Read full license terms][LICENSE].


[dependencies-badge]: https://img.shields.io/david/connected-world-services/cws-shelf-upload.svg
[dependencies-link]: https://david-dm.org/connected-world-services/cws-shelf-upload
[LICENSE]: LICENSE.md
[npm-badge]: https://img.shields.io/npm/v/cws-shelf-upload.svg
[npm-link]: https://npmjs.org/package/cws-shelf-upload
[Shelf]: https://github.com/not-nexus/shelf
