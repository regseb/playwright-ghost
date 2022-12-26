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

export default class UserAgentPlugin extends Plugin {
    static name = "polyfill/userAgent";

    static level = LEVELS.ENABLED;

    constructor() {
        super();
        // Ne pas utiliser la propriété "userAgent", des options de la méthode
        // browser.newContext(), car à la création du contexte nous ne
        // connaissons pas le userAgent (pour lui enlever le terme "Headless").
        this.addListener("Browser.newContext:after",
                         this.#patchHeader.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    async #patchHeader(context) {
        if ("chromium" === context.browser().browserType().name() &&
                context.browser().isHeadless()) {
            await context.route("**", async (route, request) => {
                await route.fallback({
                    headers: {
                        ...request.headers(),
                        "user-agent": request.headers()["user-agent"]
                                                       .replace("Headless", ""),
                    },
                });
            });
        }

        return context;
    }

    // eslint-disable-next-line class-methods-use-this
    async addInitScript(context) {
        if ("chromium" === context.browser().browserType().name() &&
                context.browser().isHeadless()) {
            return {
                path: await import.meta.resolve("./useragent.injected.js"),
            };
        }

        return undefined;
    }

    // eslint-disable-next-line class-methods-use-this
    async addInitScriptServiceWorker(context) {
        if ("chromium" === context.browser().browserType().name() &&
                context.browser().isHeadless()) {
            return {
                path: await import.meta.resolve("./useragent.injected.js"),
            };
        }

        return undefined;
    }
}
