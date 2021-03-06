#!/usr/bin/env node
"use strict";

module.exports = (log) => {
    /**
     * Adds extra metadata to the metadata object if that key is not
     * already defined.
     *
     * @param {shelfLib~metadata} metadata
     * @param {string[]} keyValueList
     * @param {boolean} immutable
     * @throws {Error}
     */
    function addExtraMetadata(metadata, keyValueList, immutable) {
        if (!Array.isArray(keyValueList)) {
            return;
        }

        keyValueList.forEach((keyValue) => {
            var key, value;

            value = keyValue.split(":");
            key = value.shift();
            value = value.join(":");

            if (!value.length) {
                return;
            }

            if (metadata[key]) {
                throw new Error(`Metadata key already defined: ${key}`);
            }

            metadata[key] = {
                immutable,
                value
            };
        });
    }


    /**
     * Builds the metadata object for the files that are being uploaded.
     *
     * @param {Object} args
     * @return {shelfLib~metadata}
     * @throws {Error}
     */
    return (args) => {
        var map, metadata;

        metadata = {};
        map = {
            build: "--build",
            branch: "--branch",
            vcsRef: "--vcs-ref",
            version: "--version"
        };
        Object.keys(map).forEach((key) => {
            var arg;

            arg = map[key];

            if (args[arg]) {
                metadata[key] = {
                    immutable: true,
                    value: args[arg]
                };
            }
        });

        addExtraMetadata(metadata, args["--immutable"], true);
        addExtraMetadata(metadata, args["--metadata"], false);
        log.debug("Metadata: %o", metadata);

        return metadata;
    };
};
