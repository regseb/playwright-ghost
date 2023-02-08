/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

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
                     this.#disable.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #disable(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [{
                ...args[0],
                args: [
                    "--disable-blink-features=AutomationControlled",
                    ...args[0]?.args ?? [],
                ],
            }];
        }

        return args;
    }
}
