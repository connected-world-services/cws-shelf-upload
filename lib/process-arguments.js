"use strict";

module.exports = (log, process, semverRegex) => {
    /**
     * Finds the token for authenticating with shelf. If it cannot
     * be found an Error will be thrown.
     *
     * @param {string} token
     * @return {string}
     * @throws {Error}
     */
    function checkAuthToken(token) {
        token = token || process.env.SHELF_AUTH_TOKEN;
        if (!token) {
            throw new Error("Either --token must be provided or the environment variable SHELF_AUTH_TOKEN must be set.");
        }

        return token;
    }

    /**
     * Makes sure there isn't multiple VCS tags being applied.
     * Confirms the VCS tag is in a correct format.
     *
     * @param {string} [ref]
     * @param {Object} otherSystems
     * @return {(string|null)} clean VCS tag string
     * @throws {Error} Includes a description of what went wrong.
     */
    function checkVcs(ref, otherSystems) {
        Object.keys(otherSystems).forEach((key) => {
            var value;

            value = otherSystems[key];

            if (!value) {
                return;
            }

            if (!ref) {
                ref = `${key},${value}`;

                return;
            }

            throw new Error("Multiple VCS tags are being applied but only one is allowed");
        });

        if (!ref) {
            log.debug("No VCS tag");

            return null;
        }

        if (!ref.match(/^[a-z0-9]+,.+$/)) {
            throw new Error("Invalid VCS tag format. Must start with the VCS system name as a prefix, then a comma.");
        }

        log.debug("Using VCS tag: ${ref}");

        return ref;
    }


    /**
     * Verifies the version is a semantic version number.
     *
     * @param {string} version
     * @throws {Error} Includes a description of why the version is invalid.
     */
    function checkVersion(version) {
        if (!version) {
            throw new Error("Empty version supplied");
        }

        if (!version.match(/^[0-9]/)) {
            throw new Error("Version number must start with a digit");
        }

        if (!semverRegex().test(version)) {
            throw new Error("Version number is not a semantic version number");
        }

        if (semverRegex().exec(version)[0] !== version) {
            throw new Error("Version number contains extra information that is not allowed in a semantic version number");
        }

        log.debug("Version number is valid: %s", version);
    }


    /**
     * Verifies and changes the arguments object:
     * - checks if version is a semver and throws when it is not.
     * - throws if multiple of --vcs-ref, --git-commit, --svn-build are set.
     * - changes --git-commit into --vcs-ref.
     * - changes --svn-build into --vcs-ref.
     * - throws if --vcs-ref is in an invalid format
     *
     * Does not return. Modifies the object directly.
     *
     * @param {Object} args
     * @throws {Error} when there are issues
     */
    return (args) => {
        var vcs;

        checkVersion(args["--version"]);
        vcs = checkVcs(args["--vcs-ref"], {
            git: args["--git-commit"],
            svn: args["--svn-build"]
        });

        if (vcs) {
            args["--vcs-ref"] = vcs;
        }

        args["--token"] = checkAuthToken(args["--token"]);
    };
};
