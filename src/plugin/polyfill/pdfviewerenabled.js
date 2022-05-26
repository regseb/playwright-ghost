/**
 * @module
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1720353
 * @see https://support.mozilla.org/en-US/questions/950988#answer-409826
 */

import { fileURLToPath } from "node:url";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

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

export default class PdfViewerEnabledPlugin extends Plugin {
    static name = "polyfill/pdfViewerEnabled";

    static level = LEVELS.ENABLED;

    // eslint-disable-next-line class-methods-use-this
    async addInitScript(context) {
        if (context.browser().isHeadless()) {
            return {
                path: await import.meta.resolve("./pdfviewerenabled.injected" +
                                                                         ".js"),
            };
        }

        return undefined;
    }
}
