/**
 * @module
 */

import Random from "../../utils/random.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class ViewportPlugin extends Plugin {

    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "polyfill/viewport";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.ENABLED;

    #options;

    constructor(options) {
        super();
        this.addHook("Browser.newContext:before",
                     this.#setViewport.bind(this));

        this.#options = {
            width:  options?.width ?? Random.getInt(1000, 1800),
            height: options?.height ?? Random.getInt(500, 800),
        };
    }

    #setViewport(args) {
        return [{
            ...args[0],
            viewport: {
                width:  this.#options.width,
                height: this.#options.height,
                ...args[0]?.viewport,
            },
        }];
    }
}
