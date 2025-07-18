/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import humanizeClickPlugin from "./click.js";
import humanizeCursorPlugin from "./cursor.js";
import humanizeDialogPlugin from "./dialog.js";

/**
 * @import { HumanizeClickOptions } from "./click.js"
 * @import { HumanizeCursorOptions } from "./cursor.js"
 * @import { HumanizeDialogOptions } from "./dialog.js"
 */

/**
 * @typedef {Object} HumanizeRecommendedOptions Les éventuelles options des
 *                                              plugins humanisant recommandés.
 * @prop {HumanizeClickOptions|boolean}  [click]  Les éventuelles options du
 *                                                plugin des clics ; ou un
 *                                                booléen pour activer /
 *                                                désactiver le plugin.
 * @prop {HumanizeCursorOptions|boolean} [cursor] Les éventuelles options du
 *                                                plugin du curseur ; ou un
 *                                                booléen pour activer /
 *                                                désactiver le plugin.
 * @prop {HumanizeDialogOptions|boolean} [dialog] Les éventuelles options du
 *                                                plugin des boîtes de
 *                                                dialogues ; ou un booléen pour
 *                                                activer / désactiver le
 *                                                plugin.
 */

/**
 * Initialise un plugin sauf s'il est désactivé.
 *
 * @param {Function}       plugin    La fonction pour créer le plugin.
 * @param {Object|boolean} [options] Les éventuelles options du plugin ; ou un
 *                                   booléen pour activer / déactiver le plugin.
 * @returns {Record<string, Function>} Les crochets du plugin ; ou un objet vide
 *                                     si le plugin est désactivé.
 */
const initPlugin = (plugin, options) => {
    return "boolean" === typeof options
        ? options
            ? plugin()
            : {}
        : plugin(options);
};

/**
 * Crée les plugins recommandés humanisant.
 *
 * @param {HumanizeRecommendedOptions} [options] Les éventuelles options des
 *                                               plugins humanisant recommandés.
 * @returns {Record<string, Function>[]} Les crochets des plugins recommandés.
 */
export default function humanizeRecommendedPlugins(options) {
    return [
        initPlugin(humanizeClickPlugin, options?.click),
        initPlugin(humanizeCursorPlugin, options?.cursor),
        initPlugin(humanizeDialogPlugin, options?.dialog),
    ];
}
