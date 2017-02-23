"use strict";

module.exports = (fsAsync, log, morePromises, now, path, randomstring, shelfError) => {
    const DEDUPLICATE_ERROR_CODE_LIST = [
        shelfError.UNAUTHORIZED,
        shelfError.NOT_FOUND
    ];


    /**
     * This function exists in order to map a few errors so that the error
     * messages are more readable. It will also attempt to deduplicate some
     * errors that likely happened all for the same reason. For example, if
     * you uploaded 10 artifacts and your token was invalid, you probably would
     * not want to be told so 10 times.
     *
     * @param {Array.<Error>} errorList
     * @param {shelfLib.Reference} reference
     * @return {Array.<string>}
     */
    function processUploadErrors(errorList, reference) {
        var errorMessage, errorMessageList, processedErrorList;

        errorMessageList = [];
        processedErrorList = [];
        errorList.forEach((error) => {
            if (error.code && DEDUPLICATE_ERROR_CODE_LIST.indexOf(error.code) > -1) {
                if (processedErrorList.indexOf(error.code) === -1) {
                    // Translate a few errors to make them easier to understand.
                    if (error.code === shelfError.UNAUTHORIZED) {
                        errorMessage = "Failed to authenticate. Either your token is incorrect or you do not have permissions to upload to that location.";
                    } else if (error.code === shelfError.NOT_FOUND) {
                        errorMessage = `The server returned "resource not found". This likely means that the shelf "${reference.refName}" does not exist`;
                    }

                    errorMessageList.push(errorMessage);
                    processedErrorList.push(error.code);
                }
            } else {
                errorMessageList.push(error.message);
            }
        });

        return errorMessageList;
    }


    /**
     * Uploads a list of files to the correct path on shelf and updates
     * each artifact with the same metadata.
     *
     * @param {Array.<FileUploader>} fileUploaderList
     * @param {shelfLib~Reference} reference
     * @return {Promise.<string>} - A list of URIs pointing to the newly
     *      created artifact resources.
     */
    function upload(fileUploaderList, reference) {
        var uploadArtifactList;


        uploadArtifactList = [];
        fileUploaderList.forEach((fileUploader) => {
            uploadArtifactList.push(fileUploader.upload());
        });

        return morePromises.settle(uploadArtifactList).then((uploadedUriList) => {
            log.info("Successfully uploaded artifacts.");
            log.info(uploadedUriList.join("\n"));

            return uploadedUriList;
        }, (errorList) => {
            var errorMessageList;

            errorMessageList = processUploadErrors(errorList, reference);
            throw new Error(`The following errors occured while attempting to upload:\n${errorMessageList.join("\n")}`);
        });
    }

    return upload;
};
