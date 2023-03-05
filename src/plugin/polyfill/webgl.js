/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

const useAngle = function (options) {
    if (options?.headless ?? true) {
        return {
            ...options,
            args: ["--use-angle", ...(options?.args ?? [])],
        };
    }

    return options;
};

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
        this.addHook(
            "BrowserType.launch:before",
            this.#useAngleOfLaunch.bind(this),
        );
        this.addHook(
            "BrowserType.launchPersistentContext:before",
            this.#useAngleOfLaunchPersistentContext.bind(this),
        );
    }

    // eslint-disable-next-line class-methods-use-this
    #useAngleOfLaunch(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [useAngle(args[0])];
        }

        return args;
    }

    // eslint-disable-next-line class-methods-use-this
    #useAngleOfLaunchPersistentContext(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [args[0], useAngle(args[1])];
        }

        return args;
    }
}
