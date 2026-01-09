/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import which from "../../utils/which.js";

/**
 * @import { BrowserType } from "playwright"
 * @import { ContextBefore } from "../../hook.js"
 */

/**
 * Le cache de la liste des exécutables des navigateurs.
 *
 * @type {Map<string, string>}
 */
const cache = new Map();

/**
 * Définit le chemin de l'exécutable du navigateur installé localement.
 *
 * @param {Record<string, any>|undefined} options Les options de création d'un
 *                                                `Browser`.
 * @param {string}                        name    Le nom du navigateur.
 * @returns {Promise<Record<string, any>>} Les nouvelles options.
 */
const setExecutablePath = async (options, name) => {
    if (!cache.has(name)) {
        cache.set(name, await which(name));
    }

    return {
        executablePath: cache.get(name),
        ...options,
    };
};

/**
 * @typedef {Object} UtilsLocaleOptions Les options du plugin `utils.locale`.
 * @prop {string} [name] Le nom du navigateur.
 */

/**
 * Crée un plugin pour utiliser le navigateur installé localement.
 *
 * @param {UtilsLocaleOptions} [options] Les éventuelles options du plugin
 *                                       `utils.locale`.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function utilsLocalePlugin(options) {
    const name = options?.name;

    return {
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "BrowserType.launch:before": async (args, { obj: browserType }) => {
            return [
                await setExecutablePath(args[0], name ?? browserType.name()),
            ];
        },

        /**
         * Modifie les options de lancement du navigateur avec persistence.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "BrowserType.launchPersistentContext:before": async (
            args,
            { obj: browserType },
        ) => {
            return [
                args[0],
                await setExecutablePath(args[1], name ?? browserType.name()),
            ];
        },

        /**
         * Modifie les options de lancement du serveur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchServer:before": async (
            args,
            { obj: browserType },
        ) => {
            return [
                await setExecutablePath(args[0], name ?? browserType.name()),
            ];
        },
    };
}
