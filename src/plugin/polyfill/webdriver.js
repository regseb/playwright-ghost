/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

const disable = function (options) {
    return {
        ...options,
        args: [
            "--disable-blink-features=AutomationControlled",
            ...options?.args ?? [],
        ],
    };
};

export default class WebdriverPlugin extends Plugin {

    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "polyfill/webdriver";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.ENABLED;

    constructor() {
        super();
        this.addHook("BrowserType.launch:before",
                     this.#disableOfLaunch.bind(this));
        this.addHook("BrowserType.launchPersistentContext:before",
                     this.#disableOfLaunchPersistentContext.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #disableOfLaunch(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [disable(args[0])];
        }

        return args;
    }

    // eslint-disable-next-line class-methods-use-this
    #disableOfLaunchPersistentContext(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [args[0], disable(args[1])];
        }

        return args;
    }
}
