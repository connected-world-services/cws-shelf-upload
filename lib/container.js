"use strict";

var container, Dizzy;

Dizzy = require("dizzy");
require("dizzy-promisify-bluebird")(Dizzy);
container = new Dizzy();

// Static values
container.register("programName", "cws-shelf-upload");

// Local modules
container.registerBulk({
    buildMetadata: "./build-metadata",
    config: "./config",
    FileUploader: "./file-uploader",
    fileUploaderListBuilder: "./file-uploader-list-builder",
    helpMessage: "./help-message",
    localFileValidator: "./local-file-validator",
    log: "./log",
    now: "./now",
    processArguments: "./process-arguments",
    upload: "./upload"
}).asFactory().fromModule(__dirname).cached();

// External modules
container.registerBulk({
    crypto: "crypto",
    debugLibrary: "debug",
    morePromises: "more-promises",
    neodoc: "neodoc",
    path: "path",
    randomstring: "randomstring",
    semverRegex: "semver-regex",
    shelfLib: "shelf-lib"
}).fromModule().cached();
container.register("process", process);
container.register("shelfError", container.resolve("shelfLib").error);
container.register("fsAsync", "fs").fromModule().promisified().cached();
module.exports = container;
