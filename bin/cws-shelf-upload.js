#!/usr/bin/env node
"use strict";

var container;

container = require("../lib/container");
container.callAsync((config, helpMessage, neodoc) => {
    var args;

    args = neodoc.run(helpMessage, config.neodocOptions);

    // Set debug in the config before we load more modules
    config.debug = !!args["--debug"];

    container.callAsync((log) => {
        var censoredArgs;

        censoredArgs = {};
        censoredArgs = Object.assign(censoredArgs, args);
        censoredArgs["--token"] = "REDACTED";
        log.debug("Parsed arguments: %o", censoredArgs);

        return container.callAsync((buildMetadata, fileUploaderListBuilder, localFileValidator, processArguments, shelfLib, upload) => {
            var fileUploaderList, metadata, ref;

            processArguments(args);
            metadata = buildMetadata(args);
            ref = shelfLib(args["--host-prefix"]).initReference(args["--shelf"], args["--token"]);

            return localFileValidator(args.FILE).then(() => {
                var result, uploadMessageList;

                fileUploaderList = fileUploaderListBuilder(args["--component"], args.FILE, metadata, ref);

                if (args["--noop"]) {
                    uploadMessageList = fileUploaderList.map((uploader) => {
                        return `${uploader.file} -> ${uploader.artifact.uri}`;
                    });
                    log.info("Would have made the following uploads:");
                    log.info(uploadMessageList.join("\n"));
                    log.info("Would have uploaded with the following metadata:");
                    log.info(JSON.stringify(metadata));
                } else {
                    result = upload(fileUploaderList, ref);
                }

                return result;
            });
        }).then(() => {
            log.info("Done");
            log.debug("Done");
        }, (err) => {
            log.error(`${err.toString()}`);
            log.debug(err.stack);

            // eslint-disable-next-line no-process-exit
            process.exit(1);
        });
    });
}).then(null, () => {
    console.log("Uncaught promise rejection");

    // eslint-disable-next-line no-process-exit
    process.exit(1);
});
