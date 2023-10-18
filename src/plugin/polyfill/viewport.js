/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Random from "../../utils/random.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

const setViewport = function (options, { width, height }) {
    return {
        ...options,
        viewport: {
            width,
            height,
            ...options?.viewport,
        },
    };
};

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
        this.addHook(
            "BrowserType.launchPersistentContext:before",
            this.#setViewportOfLaunchPersistentContext.bind(this),
        );
        this.addHook(
            "Browser.newContext:before",
            this.#setViewportOfNewContext.bind(this),
        );

        this.#options = {
            width: options?.width ?? Random.getInt(1000, 1800),
            height: options?.height ?? Random.getInt(500, 800),
        };
    }

    #setViewportOfLaunchPersistentContext(args) {
        return [args[0], setViewport(args[1], this.#options)];
    }

    #setViewportOfNewContext(args) {
        return [setViewport(args[0], this.#options)];
    }
}
