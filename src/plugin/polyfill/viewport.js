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

export default class ViewportPlugin extends Plugin {
    static name = "polyfill/viewport";

    static level = LEVELS.ENABLED;

    #options;

    constructor(options) {
        super();
        this.addListener("Browser.newContext:before",
                         this.#setViewport.bind(this));

        this.#options = {
            innerHeight: options?.innerHeight ?? 735,
            innerWidth:  options?.innerWidth ?? 1496,
            outerHeight: options?.outerHeight ?? 808,
            outerWidth:  options?.outerWidth ?? 1496,
            screenX:     options?.screenX ?? 40,
            screenY:     options?.screenY ?? 56,
            screen:      {
                availHeight: options?.screen?.availHeight ?? 837,
                availLeft:   options?.screen?.availLeft ?? 40,
                availTop:    options?.screen?.availTop ?? 27,
                availWidth:  options?.screen?.availWidth ?? 1496,
                width:       options?.screen?.width ?? 1536,
                height:      options?.screen?.height ?? 864,
            },
        };
    }

    #setViewport(args, { obj: browser }) {
        if (browser.isHeadless()) {
            return [{
                viewport: {
                    width:  this.#options.innerWidth,
                    height: this.#options.innerHeight,
                    ...args[0]?.viewport,
                },
                ...args[0],
            }];
        }

        return args;
    }

    async addInitScript(context) {
        if (context.browser().isHeadless()) {
            return {
                path: await import.meta.resolve("./viewport.injected.js"),
                args: {
                    outerHeight: this.#options.outerHeight,
                    outerWidth:  this.#options.outerWidth,
                    screenX:     this.#options.screenX,
                    screenY:     this.#options.screenY,
                    screen:      this.#options.screen,
                },
            };
        }

        return undefined;
    }
}
