/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Modifie la taille de l'écran.
 *
 * @param {Object} [options] Les options de création d'un
 *                           <code>BrowserContext</code>.
 * @param {number} width     La largeur de l'écran.
 * @param {number} height    La hauteur de l'écran.
 * @returns {Object} Les nouvelles options.
 */
const setScreen = (options, width, height) => {
    return {
        ...options,
        screen: { width, height, ...options?.screen },
    };
};

/**
 * Crée un plugin pour définir la taille de l'écran. Par défaut la valeur
 * réaliste <em>1920x1080</em> est utilisée.
 *
 * @param {Object} [options]        Les options du plugin.
 * @param {number} [options.width]  La largeur de l'écran.
 * @param {number} [options.height] La hauteur de l'écran.
 */
export default function screenPlugin(options) {
    const width = options?.width ?? 1920;
    const height = options?.height ?? 1080;

    return {
        "BrowserType.launchPersistentContext:before": (args) => {
            return [args[0], setScreen(args[1], width, height)];
        },

        "Browser.newContext:before": (args) => {
            return [setScreen(args[0], width, height)];
        },

        "Browser.newPage:before": (args) => {
            return [setScreen(args[0], width, height)];
        },
    };
}
