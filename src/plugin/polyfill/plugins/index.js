/**
 * @module
 */

import { fileURLToPath } from "node:url";
import InitScriptPlugin from "../../meta/initscriptplugin.js";

if (undefined === import.meta.resolve) {

    /**
     * Résous un chemin relatif à partir du module.
     *
     * @param {string} specifier Le chemin relatif vers un fichier ou un
     *                           répertoire.
     * @returns {Promise<string>} Une promesse contenant le chemin absolue vers
     *                            le fichier ou le répertoire.
     * @see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
     */
    import.meta.resolve = (specifier) => {
        return Promise.resolve(fileURLToPath(new URL(specifier,
                                                     import.meta.url).href));
    };
}

export default class Plugins extends InitScriptPlugin {
    async getScript(browserContext) {
        if (browserContext.browser().isHeadless()) {
            return {
                path: await import.meta.resolve("./script.injected.js"),
            };
        }
        return undefined;
    }
}
