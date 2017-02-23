"use strict";


module.exports = (crypto, fsAsync, log) => {
    /**
     * The most important part of why this class exists is to keep a file paired
     * with a shelLib~Artifact.
     */
    class FileUploader {
        /**
         * File can be relative or absolute.
         *
         * @param {shelfLib~Artifact} artifact
         * @param {string} file
         * @param {shelfLib~metadata} metadata
         */
        constructor(artifact, file, metadata) {
            this.artifact = artifact;
            this.file = file;
            this.metadata = metadata;
        }


        /**
         * Gets the MD5 hash for the local file.
         *
         * @return {Promise.<string>}
         */
        loadLocalMd5Hash() {
            var hash, promise, stream;

            stream = fsAsync.createReadStream(this.file);
            hash = crypto.createHash("md5");

            promise = new Promise((resolve, reject) => {
                stream.on("readable", () => {
                    const data = stream.read();

                    if (data) {
                        hash.update(data);
                    } else {
                        resolve(hash.digest("hex"));
                    }
                });
                stream.on("error", (error) => {
                    reject(error);
                });
            });

            return promise;
        }


        /**
         * Uploads a single file and assigns the shared metadata
         * provided in its parent function. The file path can be
         * relative or absolute.
         *
         * @return {Promise.<string>}
         */
        upload() {
            var fullMetadata, uri;

            uri = this.artifact.uri;
            log.debug(`Attempting to upload to "${uri}"`);

            return this.artifact.uploadFromFile(this.file).then(() => {
                log.debug(`Successfully uploaded ${this.file}`);

                return this.artifact.metadata.getAll();
            }).then((existingMetadata) => {
                fullMetadata = {};

                /**
                 * I did this for future proofing. If shelf
                 * were to automatically add a none immutable
                 * property I didn't want it to be deleted.
                 */
                Object.assign(fullMetadata, existingMetadata, this.metadata);

                return this.loadLocalMd5Hash();
            }).then((localMd5Hash) => {
                var remoteHash;

                remoteHash = fullMetadata.md5Hash.value;
                log.debug(`Local MD5 Hash: ${localMd5Hash}`);
                log.debug(`Remote MD5 Hash: ${remoteHash}`);

                if (localMd5Hash !== remoteHash) {
                    throw new Error(`The local MD5 hash for ${this.file} does not equal the uploaded artifact\'s MD5 at ${uri}`);
                }
            }).then(() => {
                log.debug(`Attempting to upload metadata for ${uri}: ${JSON.stringify(fullMetadata)}`);

                return this.artifact.metadata.updateAll(fullMetadata);
            }).then(() => {
                log.debug(`Successfully updated metadata for ${uri}`);

                return uri;
            });
        }
    }

    return FileUploader;
};
