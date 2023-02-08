/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class WebGLPlugin extends Plugin {

    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "polyfill/webGL";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.ENABLED;

    constructor() {
        super();
        this.addHook("BrowserType.launch:before",
                     this.#useAngle.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #useAngle(args, { obj: browserType }) {
        if ("chromium" === browserType.name() && (args[0]?.headless ?? true)) {
            return [{
                ...args[0],
                args: [
                    ...args[0]?.args ?? [],
                    "--use-angle",
                ],
            }];
        }

        return args;
    }
}
