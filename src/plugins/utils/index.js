/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import utilsLocalePlugin from "./locale.js";

/**
 * @typedef {import("./locale.js").UtilsLocaleOptions} UtilsLocaleOptions
 */

/**
 * Les plugins utilitaires.
 */
const utilsPlugins = {
    locale: utilsLocalePlugin,
};
export default utilsPlugins;
