/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/* @ts-self-types="../../types/plugins/index.d.ts" */

import debugPlugins from "./debug/index.js";
import humanizePlugins from "./humanize/index.js";
import polyfillPlugins from "./polyfill/index.js";
import recommendedPlugins from "./recommended.js";
import utilsPlugins from "./utils/index.js";

/**
 * La liste de tous les plugins regroupés par catégorie.
 */
const plugins = {
    polyfill: polyfillPlugins,
    humanize: humanizePlugins,
    utils: utilsPlugins,
    debug: debugPlugins,

    recommended: recommendedPlugins,
};
export default plugins;
