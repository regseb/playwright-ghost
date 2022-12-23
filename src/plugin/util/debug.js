/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class DebugPlugin extends Plugin {
    static name = "util/debug";

    static level = LEVELS.DISABLED;

    constructor() {
        super();
        this.addListener("BrowserContext.newPage:after",
                         this.#addConsole.bind(this));
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
