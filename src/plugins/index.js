/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import humanizePlugins from "./humanize/index.js";
import polyfillPlugins from "./polyfill/index.js";
import recommendedPlugins from "./recommended.js";
import utilsPlugins from "./utils/index.js";

/**
 * La liste de tous les plugins regroupés par catégorie.
 */
export default {
    polyfill: polyfillPlugins,
    humanize: humanizePlugins,
    utils: utilsPlugins,

    recommended: recommendedPlugins,
};
