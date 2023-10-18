/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

const setScreen = function (options, { width, height }) {
    return {
        ...options,
        screen: {
            width,
            height,
            ...options?.screen,
        },
    };
};

export default class ScreenPlugin extends Plugin {
    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "polyfill/screen";

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
            this.#setScreenOfLaunchPersistentContext.bind(this),
        );
        this.addHook(
            "Browser.newContext:before",
            this.#setScreenOfNewContext.bind(this),
        );

        this.#options = {
            width: options?.width ?? 1920,
            height: options?.height ?? 1080,
        };
    }

    #setScreenOfLaunchPersistentContext(args) {
        return [args[0], setScreen(args[1], this.#options)];
    }

    #setScreenOfNewContext(args) {
        return [setScreen(args[0], this.#options)];
    }
}
