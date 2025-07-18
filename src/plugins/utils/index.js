/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import utilsAdblockerPlugin from "./adblocker.js";
import utilsDebugPlugin from "./debug.js";
import utilsFingerprintPlugin from "./fingerprint.js";
import utilsLocalePlugin from "./locale.js";
import utilsXvfbPlugin from "./xvfb.js";

/**
 * @typedef {import("./adblocker.js").UtilsAdblockerOptions} UtilsAdblockerOptions
 * @typedef {import("./fingerprint.js").UtilsFingerprintOptions} UtilsFingerprintOptions
 * @typedef {import("./locale.js").UtilsLocaleOptions} UtilsLocaleOptions
 * @typedef {import("./xvfb.js").UtilsXvfbOptions} UtilsXvfbOptions
 */

/**
 * Les plugins utilitaires.
 */
export default {
    adblocker: utilsAdblockerPlugin,
    debug: utilsDebugPlugin,
    fingerprint: utilsFingerprintPlugin,
    locale: utilsLocalePlugin,
    xvfb: utilsXvfbPlugin,
};
