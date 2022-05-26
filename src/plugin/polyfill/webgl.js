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

export default class WebGLPlugin extends Plugin {
    static name = "polyfill/webGL";

    static level = LEVELS.ENABLED;

    #useGL;

    constructor(options) {
        super();
        this.addListener("BrowserType.launch:before",
                         this.#setGL.bind(this));

        this.#useGL = options?.useGL ?? "egl";
    }

    #setGL(args) {
        if (args[0]?.headless ?? true) {
            return [{
                ...args[0],
                args: [
                    `--use-gl=${this.#useGL}`,
                    ...args[0]?.args ?? [],
                ],
            }];
        }

        return args;
    }

    // eslint-disable-next-line class-methods-use-this
    async addInitScript(context) {
        if ("chromium" === context.browser().browserType().name() &&
                context.browser().isHeadless()) {
            return { path: await import.meta.resolve("./webgl.injected.js") };
        }

        return undefined;
    }
}
