/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class DebugPlugin extends Plugin {
    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "util/debug";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.DISABLED;

    constructor() {
        super();
        this.addHook(
            "BrowserContext.newPage:after",
            this.#addConsole.bind(this),
        );
    }

    // eslint-disable-next-line class-methods-use-this
    #addConsole(page) {
        // eslint-disable-next-line no-console
        page.on("console", (m) => console.log(m));
        // eslint-disable-next-line no-console
        page.on("pageerror", (e) => console.error(e));
        return page;
    }
}
