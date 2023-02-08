/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

const changeHeadless = function (options) {
    if (options?.headless ?? true) {
        return {
            ...options,
            args: [
                "--headless=new",
                ...options?.args ?? [],
            ],
        };
    }

    return options;
};

export default class HeadlessNewPlugin extends Plugin {

    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "polyfill/common";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.ENABLED;

    constructor() {
        super();
        this.addHook("BrowserType.launch:before",
                     this.#setHeadlessOfLaunch.bind(this));
        this.addHook("BrowserType.launchPersistentContext:before",
                     this.#setHeadlessOfLaunchPersistentContext.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #setHeadlessOfLaunch(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [changeHeadless(args[0])];
        }

        return args;
    }

    // eslint-disable-next-line class-methods-use-this
    #setHeadlessOfLaunchPersistentContext(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [args[0], changeHeadless(args[1])];
        }

        return args;
    }
}
