/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class BlockerPlugin extends Plugin {
    static name = "util/blocker";

    static level = LEVELS.DISABLED;

    #urls;

    constructor(options) {
        super();
        this.#urls = options.urls ?? [];
        this.addListener("BrowserContext.newPage:after",
                         this.#block.bind(this));
    }

    async #block(page) {
        for (const url of this.#urls) {
            await page.route(url, (r) => r.abort());
        }
        return page;
    }
}
