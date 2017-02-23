"use strict";

module.exports = () => {
    return `cws-shelf-upload usage:

    cws-shelf-upload --shelf=NAME --component=NAME --version=X.Y.Z [OPTIONS] FILE [FILE]...

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

For additional information see https://github.com/connected-world-services/cws-shelf-upload`;
};
