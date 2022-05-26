/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

const getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

export default class DialogPlugin extends Plugin {
    static name = "humanize/dialog";

    static level = LEVELS.ENABLED;

    #options;

    constructor(options) {
        super();
        this.addListener("BrowserContext.newPage:after",
                         this.#wait.bind(this));

        this.#options = {
            min: options?.min ?? 1000,
            max: options?.max ?? 5000,
        };
    }

    #wait(page) {
        page.on("dialog", (dialog) => {
            setTimeout(() => dialog.accept(),
                       getRandomInt(this.#options.min, this.#options.max));
        });
        return page;
    }
}
