/**
 * @module
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

export default class RttPlugin extends Plugin {
    static name = "polyfill/rtt";

    static level = LEVELS.ENABLED;

    #rtt;

    constructor(options) {
        super();
        // Prendre par défaut un nombre aléatoire entre 25 et 150.
        this.#rtt = options?.rtt ?? 25 * Math.round(Math.random() * 6 + 1);
    }

    async addInitScript(context) {
        if ("chromium" === context.browser().browserType().name() &&
                context.browser().isHeadless()) {
            return {
                path: await import.meta.resolve("./rtt.injected.js"),
                args: { rtt: this.#rtt },
            };
        }

        return undefined;
    }
}
