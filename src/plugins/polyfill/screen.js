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
 * @returns {Record<string, any>|undefined} Les nouvelles options.
 */
const setScreen = (options, width, height) => {
    return {
        ...options,
        screen: { width, height, ...options?.screen },
    };
};

/**
 * Crée un plugin pour définir la taille de l'écran. Par défaut la valeur
 * réaliste _1920x1080_ est utilisée.
 *
 * @param {Object} [options]        Les options du plugin.
 * @param {number} [options.width]  La largeur de l'écran.
 * @param {number} [options.height] La hauteur de l'écran.
 */
export default function screenPlugin(options) {
    const width = options?.width ?? 1920;
    const height = options?.height ?? 1080;

    return {
        /**
         * Modifie les options de lancement du navigateur.
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
         * Modifie les options de création d'une page.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newPage:before": (args) => {
            return [setScreen(args[0], width, height)];
        },
    };
}
