"use strict";

module.exports = () => {
    return `cws-shelf-upload usage:

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

Example:

    # A typical upload of a new code base.
    export SHELF_AUTH_TOKEN="my-secret-token-here"
    cws-shelf-upload --shelf=dev-team --component=reporting-api \\
        --git-commit=1337490af3ec86625de1d24d30595e3b42884b2c \\
        --version=0.0.1 --branch=develop built-application.zip

    # uploading multiple files at once
    export SHELF_AUTH_TOKEN="my-secret-token-here"
    cws-shelf-upload --shelf=dev-team --component=app-engine \\
        --version=1.0.0 application.jar override-config-example.json

Notes:

Files will be uploaded to Shelf using a path that's constructed using this
pattern:

    /<shelf>/artifact/<component>/<timestampAndRandomId>/<file>

The timestamp is in the format YYYY-MM-DD-HH-MM-SS.SSS.
The random id is 10 characters long. It exists to make conflicts less likely.

After uploading the file, its MD5 hash and size are compared against the
metadata on the server to guarantee that the file was uploaded correctly.

If there are any problems, this program exits with a non-zero status code.`;
};
