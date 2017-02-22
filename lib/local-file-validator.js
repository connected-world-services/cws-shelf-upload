"use strict";

module.exports = (fsAsync, morePromises) => {
    /**
     * Figures out if a file exists and if it is readable. If it is not, then
     * it will reject with the filePath.
     *
     * @param {string} filePath
     * @return {Promise.<undefined>}
     */
    function validateFileReadable(filePath) {
        /**
         * fs.constants was added in v6.1. Adding this to make it more
         * backwards compatible.
         */
        return fsAsync.accessAsync(filePath, (fsAsync.constants || fsAsync).R_OK).then(null, () => {
            return Promise.reject(filePath);
        });
    }

    /**
     * Makes sure that the local files provided are all valid.
     *
     * @param {Array.<string>} fileList
     * @return {Promise.<undefined>}
     */
    function validate(fileList) {
        var statPromiseList;

        /**
         * Make sure that all files exist and are readable up front. If
         * I can't upload one of the files I don't want to upload any of
         * them, especially in case they depend on each other existing.
         */
        statPromiseList = [];
        fileList.forEach((filePath) => {
            statPromiseList.push(validateFileReadable(filePath));
        });

        return morePromises.settle(statPromiseList).then(null, (errorList) => {
            var errorMessage;

            errorMessage = `The following files either do not exist or are not readable: ${errorList.join(", ")}`;
            throw new Error(errorMessage);
        });
    }

    return validate;
};
