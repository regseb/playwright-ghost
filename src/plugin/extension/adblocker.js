/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

/**
 * @typedef {import("playwright").Page} Page
 */

const getBlocker = async function (options) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { PlaywrightBlocker } = await import("@cliqz/adblocker-playwright");
    switch (options.mode) {
        case "parse":
            return PlaywrightBlocker.parse(options.filters, options.config);
        case "fromLists":
            return PlaywrightBlocker.fromLists(
                options.fetch ?? fetch,
                options.urls,
                options.config,
            );
        case "fromPrebuiltAdsOnly":
            return PlaywrightBlocker.fromPrebuiltAdsOnly(
                options.fetch ?? fetch,
            );
        case "fromPrebuiltAdsAndTracking":
            return PlaywrightBlocker.fromPrebuiltAdsAndTracking(
                options.fetch ?? fetch,
            );
        case "fromPrebuiltFull":
            return PlaywrightBlocker.fromPrebuiltFull(options.fetch ?? fetch);
        default:
            throw new TypeError("invalid options");
    }
};

export default class AdblockerPlugin extends Plugin {
    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "extension/adblocker";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.DISABLED;

    #options;

    constructor(options) {
        super();
        if (undefined === options) {
            this.#options = { mode: "fromPrebuiltAdsAndTracking" };
        } else if (options instanceof String) {
            this.#options = { mode: options };
        } else {
            this.#options = options;
        }

        this.addHook(
            "BrowserContext.newPage:after",
            this.#addAdBlocker.bind(this),
        );
    }

    /**
     * Ajoute un bloqueur de publicité.
     *
     * @param {Page} page La <code>Page</code>.
     * @returns {Promise<Page>} La <code>Page</code> avec le bloqueur.
     */
    async #addAdBlocker(page) {
        const blocker = await getBlocker(this.#options);
        blocker.enableBlockingInPage(page);
        return page;
    }
}
