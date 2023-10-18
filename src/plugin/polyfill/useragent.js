/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

const changeUserAgent = function (options, userAgent) {
    if (options?.headless ?? true) {
        return {
            ...options,
            args: [`--user-agent=${userAgent}`, ...(options?.args ?? [])],
        };
    }

    return options;
};

/**
 * Le plugin pour corriger le <em>user agent</em> de Chromium.
 */
export default class UserAgentPlugin extends Plugin {
    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "polyfill/userAgent";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.DISABLED;

    #userAgent;

    constructor(options) {
        super();
        this.addHook(
            "BrowserType.launch:before",
            this.#setUserAgentOfLaunch.bind(this),
        );
        this.addHook(
            "BrowserType.launchPersistentContext:before",
            this.#setUserAgentOfLaunchPersistentContext.bind(this),
        );
        this.#userAgent = options.userAgent;
    }

    #setUserAgentOfLaunch(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [changeUserAgent(args[0], this.#userAgent)];
        }

        return args;
    }

    #setUserAgentOfLaunchPersistentContext(args, { obj: browserType }) {
        if ("chromium" === browserType.name()) {
            return [args[0], changeUserAgent(args[1], this.#userAgent)];
        }

        return args;
    }
}
