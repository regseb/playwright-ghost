/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { BrowserType } from "playwright"
 * @import { ContextBefore } from "../../hook.js"
 */

/**
 * Utilise _Angle_ pour _WebGL_ dans Chromium.
 *
 * @param {Record<string, any>|undefined} options     Les options de création
 *                                                    d'un `Browser`.
 * @param {BrowserType}                   browserType Le type de navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
 */
const useAngle = (options, browserType) => {
    if ("chromium" === browserType.name() && (options?.headless ?? true)) {
        return {
            ...options,
            args: ["--use-angle", ...(options?.args ?? [])],
        };
    }
    return options;
};

/**
 * Crée un plugin pour modifier les valeurs des paramètres _WebGL_ en mode
 * _headless_.
 */
export default function webGLPlugin() {
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
            return [useAngle(args[0], browserType)];
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
            return [args[0], useAngle(args[1], browserType)];
        },
    };
}
