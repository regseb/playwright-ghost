/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Modifie la taille de l'écran.
 *
 * @param {Record<string, any>|undefined} options Les options de création d'un
 *                                                `Browser`.
 * @param {number}                        width   La largeur de l'écran.
 * @param {number}                        height  La hauteur de l'écran.
 * @returns {Record<string, any>} Les nouvelles options.
 */
const setScreen = (options, width, height) => {
    return {
        ...options,
        screen: { width, height, ...options?.screen },
    };
};

/**
 * @typedef {Object} PolyfillScreenOptions Les options du plugin `polyfill.screen`.
 * @prop {number} [width]  La largeur de l'écran.
 * @prop {number} [height] La hauteur de l'écran.
 */

/**
 * Crée un plugin pour définir la taille de l'écran. Par défaut la valeur
 * réaliste _1920x1080_ est utilisée.
 *
 * @param {PolyfillScreenOptions} [options] Les éventuelles options du plugin
 *                                          `polyfill.screen`.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function polyfillScreenPlugin(options) {
    const width = options?.width ?? 1920;
    const height = options?.height ?? 1080;

    return {
        /**
         * Modifie les options de lancement d'un contexte (et du navigateur).
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (args) => {
            return [args[0], setScreen(args[1], width, height)];
        },

        /**
         * Modifie les options de création d'un contexte.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newContext:before": (args) => {
            return [setScreen(args[0], width, height)];
        },

        /**
         * Modifie les options de création d'un contexte d'une page.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newPage:before": (args) => {
            return [setScreen(args[0], width, height)];
        },
    };
}
