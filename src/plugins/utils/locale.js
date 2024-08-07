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
 * La liste des exécutables des navigateurs.
 *
 * @type {Map<string, string>}
 */
const EXECUTABLE_PATHS = new Map();
for (const name of ["chromium", "firefox", "webkit"]) {
    try {
        EXECUTABLE_PATHS.set(name, await which(name));
    } catch {
        // Ignorer les navigateurs qui n'ont pas été trouvés, car c'est normal
        // qu'ils ne soient pas tous installés. Par contre si le plugin est
        // utilisé avec un navigateur non-installé, le plugin remontera une
        // erreur.
    }
}

/**
 * Définit le chemin de l'exécutable du navigateur installé localement.
 *
 * @param {Object|undefined} options     Les options de création d'un
 *                                       <code>Browser</code>.
 * @param {BrowserType}      browserType Le type de navigateur.
 * @returns {Object|undefined} Les nouvelles options.
 * @throws {Error} Si le navigateur n'est pas installé localement.
 */
const setExecutablePath = function (options, browserType) {
    const name = browserType.name();
    if (!EXECUTABLE_PATHS.has(name)) {
        throw new Error(`${name} not found locally`);
    }
    return {
        executablePath: EXECUTABLE_PATHS.get(name),
        ...options,
    };
};

/**
 * Crée un plugin pour utiliser le navigateur installé localement.
 */
export default function localePlugin() {
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
            return [setExecutablePath(args[0], browserType)];
        },

        /**
         * Modifie les options de lancement du navigateur.
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
            return [args[0], setExecutablePath(args[1], browserType)];
        },
    };
}
