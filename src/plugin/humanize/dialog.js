/**
 * @module
 */

import Random from "../../utils/random.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class DialogPlugin extends Plugin {

    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "humanize/dialog";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.ENABLED;

    #options;

    constructor(options) {
        super();
        this.addHook("BrowserContext.newPage:after",
                     this.#wait.bind(this));

        this.#options = {
            min: options?.min ?? 1000,
            max: options?.max ?? 5000,
        };
    }

    #wait(page) {
        page.on("dialog", (dialog) => {
            setTimeout(() => dialog.accept(),
                       Random.getInt(this.#options.min, this.#options.max));
        });
        return page;
    }
}
