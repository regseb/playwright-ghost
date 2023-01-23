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

export default class WebdriverPlugin extends Plugin {
    static name = "polyfill/webdriver";

    static level = LEVELS.ENABLED;

    constructor() {
        super();
        this.addListener("BrowserType.launch:before",
                         this.#disable.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #disable(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [{
                ...args[0],
                args: [
                    ...args[0]?.args ?? [],
                    "--disable-blink-features=AutomationControlled",
                ],
            }];
        }

        return args;
    }
}
