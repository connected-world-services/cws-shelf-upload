"use strict";

module.exports = (FileUploader, now, path, randomstring) => {
    /**
     * Creates a list of artifacts. Each path in fileList
     * can either be relative or absolute.
     *
     * A component defines a type of artifact that
     * is used to build an image. For example, it could be the code base
     * for the "reporting-api".*
     *
     * @param {string} component
     * @param {Array.<string>} fileList
     * @param {shelfLib~metadata} metadata
     * @param {shelfLib~Reference} reference
     * @return {Promise.<Array.<FileUploader>>}
     */
    function create(component, fileList, metadata, reference) {
        var artifact, artifactPath, fileUploaderList, uniqueId;

        fileUploaderList = [];
        uniqueId = `${now()}-${randomstring.generate(10)}`;

        fileList.forEach((file) => {
            var filename, fileUploader;

            filename = path.basename(file);
            artifactPath = `${component}/${uniqueId}/${filename}`;
            artifact = reference.initArtifact(artifactPath);
            fileUploader = new FileUploader(artifact, file, metadata);
            fileUploaderList.push(fileUploader);
        });

        return fileUploaderList;
    }

    return create;
};
