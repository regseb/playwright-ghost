/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import utilsAdblockerPlugin from "./adblocker.js";
import utilsCamoufoxPlugin from "./camoufox.js";
import utilsDebugPlugin from "./debug.js";
import utilsFingerprintPlugin from "./fingerprint.js";
import utilsLocalePlugin from "./locale.js";
import utilsXvfbPlugin from "./xvfb.js";

/**
 * @typedef {import("./adblocker.js").UtilsAdblockerOptions} UtilsAdblockerOptions
 * @typedef {import("./camoufox.js").UtilsCamoufoxOptions} UtilsCamoufoxOptions
 * @typedef {import("./debug.js").UtilsDebugOptions} UtilsDebugOptions
 * @typedef {import("./fingerprint.js").UtilsFingerprintOptions} UtilsFingerprintOptions
 * @typedef {import("./locale.js").UtilsLocaleOptions} UtilsLocaleOptions
 * @typedef {import("./xvfb.js").UtilsXvfbOptions} UtilsXvfbOptions
 */

/**
 * Les plugins utilitaires.
 */
export default {
    adblocker: utilsAdblockerPlugin,
    camoufox: utilsCamoufoxPlugin,
    /**
     * @deprecated Since version 0.16, debugging plugins are located in debug.
     */
    debug: utilsDebugPlugin,
    fingerprint: utilsFingerprintPlugin,
    locale: utilsLocalePlugin,
    xvfb: utilsXvfbPlugin,
};
