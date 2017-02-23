"use strict";

module.exports = () => {
    return () => {
        return new Date().toISOString().replace(/:/g, "-").replace(/T/g, "-").replace("Z", "");
    };
};
