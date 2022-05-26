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

export default class UserAgentDataPlugin extends Plugin {
    static name = "polyfill/userAgentData";

    static level = LEVELS.ENABLED;

    constructor() {
        super();
        this.addListener("Browser.newContext:after",
                         this.#patchHeader.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    async #patchHeader(context) {
        if ("chromium" === context.browser().browserType().name() &&
                context.browser().isHeadless()) {
            const version = context.browser().version().replace(/\..*/u, "");

            await context.route("**", (route) => {
                const headers = {
                    ...route.request().headers,
                    "sec-ch-ua": `" Not A;Brand";v="99",` +
                                 `"Chromium":v="${version}"`,
                };
                route.continue({ headers });
            });
        }

        return context;
    }

    // eslint-disable-next-line class-methods-use-this
    async addInitScript(context) {
        if ("chromium" === context.browser().browserType().name() &&
                context.browser().isHeadless()) {
            const version = context.browser().version().replace(/\..*/u, "");

            return {
                path: await import.meta.resolve("./useragentdata.injected.js"),
                args: { version },
            };
        }

        return undefined;
    }
}
