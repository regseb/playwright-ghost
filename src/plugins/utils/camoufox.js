/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { launchOptions } from "camoufox-js";

/**
 * @import { BrowserType } from "playwright"
 * @import { LaunchOptions } from "camoufox-js"
 * @import { ContextBefore } from "../../hook.js"
 */

/**
 * Surcharge les options avec celles générées par Camoufox.
 *
 * @param {Record<string, any>|undefined} options         Les options de
 *                                                        création d'un
 *                                                        `Browser`.
 * @param {Record<string, any>}           camoufoxOptions Les options, générées
 *                                                        par Camoufox, de
 *                                                        création d'un
 *                                                        `Browser`.
 * @param {BrowserType}                   browserType     Le type de navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
 */
const override = (options, camoufoxOptions, browserType) => {
    if ("firefox" === browserType.name()) {
        return { ...camoufoxOptions, ...options };
    }
    return options;
};

/**
 * @typedef {LaunchOptions} UtilsCamoufoxOptions Les options du plugin
 *                                               `utils.camoufox` qui sont les
 *                                               options de Camoufox (passées à
 *                                               la fonction `launchOptions()`).
 */

/**
 * Crée un plugin pour surcharger les options de création d'un `Browser` avec
 * celles générées par Camoufox.
 *
 * @param {UtilsCamoufoxOptions} [options] Les éventuelles options du plugin
 *                                         `utils.camoufox`.
 * @returns {Promise<Record<string, Function>>} Une promesse contenant le
 *                                              crochet du plugin.
 * @see https://github.com/apify/camoufox-js
 */
export default async function camoufoxPlugin(options) {
    const camoufoxOptions = await launchOptions(options ?? {});

    return {
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            return [override(args[0], camoufoxOptions, browserType)];
        },

        /**
         * Modifie les options de lancement du navigateur avec persistence.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType },
        ) => {
            return [args[0], override(args[1], camoufoxOptions, browserType)];
        },

        /**
         * Modifie les options de lancement du serveur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchServer:before": (args, { obj: browserType }) => {
            return [override(args[0], camoufoxOptions, browserType)];
        },
    };
}
