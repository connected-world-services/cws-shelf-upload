cws-shelf-upload
================

[Shelf] is a generic API and making something generic means that it can be complicated to work with. This tool is aimed at narrowing down how Shelf is used specifically for Connected World Services.


[![npm version][npm-badge]][npm-link]
[![Dependencies][dependencies-badge]][dependencies-link]

Overview
--------

	cws-shelf-upload usage:

		cws-shelf-upload --shelf=NAME --component=NAME
			--version=X.Y.Z [OPTIONS] FILE [FILE]...

	Arguments:

		FILE                   Required: The path to at least one file to upload.
							   You may provide this as many times as you wish and
							   they will all be uploaded to the same directory. Any
							   type of file can be uploaded.

	Options:

		--build <NUMBER>       Optional: Specifies the build number in the
							   metadata. This will be immutable.

		--branch <NAME>        Optional: Indicates the version control branch that
							   was the source for this file. Immutableonce
							   uploaded.

		--component <NAME>     Required: What component is being uploaded to Shelf.
							   This is used in the path.

		--debug                Optional: Enable debug logging.
							   [env: DEBUG]

		--git-commit <COMMIT>  Optional: Sets VCS Reference sting to a specific git
							   commit. Immutable once uploaded.

		--help, -h             Optional: Show this helpful message.

		--immutable <KEY:VALUE>...
							   Optional: Add extra metadata. Immutable once
							   uploaded. This option can be repeated.

		--metadata <KEY:VALUE>...
							   Optional: Add extra metadata. This option can be
							   repeated.

		--noop, -n             Do not perform the upload. Simply output what
							   would have happened.

		--shelf <NAME>         Required: The main grouping on Shelf where the files
							   will be uploaded. This is used in the path.

		--svn-build <BUILD>    Optional: Sets the VCS Reference string to a
							   subversion build number. Immutable once uploaded.

		--token <AUTHTOKEN>    Optional: Shelf authorization token. Either this or
							   an environment variable must be provided.
							   [env: SHELF_AUTH_TOKEN]

		--vcs-ref <REFSTRING>  Optional: Indicate a specific revision tracked by a
							   version control system that was used to build the
							   file. Immutable once uploaded.

		--version <X.Y.Z>      Required: Specify a semantic version number.
							   Immutable once uploaded. Must start with a digit and
							   be a valid semantic version number.

		--host-prefix <PREFIX> Optional: The protocol and host you would like to
							   make a request to.
							   [default: https://api.shelf.cwscloud.net]

	If there are any problems, this program exits with a non-zero status code.

Before this tool, the only way to upload things to [Shelf] was to use tools like curl which can be difficult to use even for people familiar with it. `cws-shelf-upload` was created as a stop gap for a full UI. It is an improvement in the following ways:

* No need to type in host and protocol.
* No need to think about the path you want to upload an artifact in. We just require you to provide `--shelf` and `--component` and the file you are uploading.
* Ensure the path is unqiue so there are no conflicts.
* Forces `--version` to be provided so that downstream systems can rely on it being there.
* Ensures the file uploaded was uploaded without becoming corrupt by validating its `md5Hash`.
* Provides a more shell friendly format for metadata. No need to enter JSON.

There are, however, many things this tool does NOT do:

* Searching.
* Create/Read/Update/Delete metadata when an artifact is not being uploaded.

Files will be uploaded to Shelf using a path that's constructed using this pattern:

    /<shelf>/artifact/<component>/<timestampAndRandomId>/<file>

The timestamp is in the format YYYY-MM-DD-HH-MM-SS.SSS. The random id is 10 characters long. It exists to make conflicts less likely.


Metadata Parsing
----------------

Everything before the first colon(:) will be the metadata name and everything afterwards will be the value. That means that although the Shelf API supports it, you cannot make a metadata property with a name that has a colon in it.

Examples
--------

For full information on the tool use the `--help` option. The following is an example of uploading a new code base for the "reporting-api" to the "shadow" product. I also want to add a `buildNumber` to my new artifact.

Note: `--shelf` is what some would refer to as a "bucket" or "storage".

    $ export SHELF_AUTH_TOKEN="supersecrettoken"
    $ cws-shelf-upload --shelf="shadow" --component="reporting-api" --version=1.0.0 --immutable=buildNumber:4 reporting-api.gz.tar
    Successfully uploaded artifacts.
    https://api.shelf.cwscloud.net/shadow/artifact/reporting-api/2017-02-17-15-58-29.397Z-5jHodx2U3J/reporting-api.gz.tar
    Done

You can use the full URI given back to perform other [Shelf] queries.

You can also upload multiple files to the same directory if you need to.

    $ export SHELF_AUTH_TOKEN="supersecrettoken"
    $ cws-shelf-upload --shelf=shadow --component=app-engine --version=1.0.0 application.jar override-config-example.json
    Successfully uploaded artifacts.
    https://api.shelf.cwscloud.net/shadow/artifact/app-engine/2017-02-23-17-27-39.589-GyVnIMEET8/applicatin.jar
    https://api.shelf.cwscloud.net/shadow/artifact/app-engine/2017-02-23-17-27-39.589-GyVnIMEET8/override-config-example.json
    Done


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
