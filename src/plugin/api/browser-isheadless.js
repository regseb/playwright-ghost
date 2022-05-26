/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class IsHeadlessPlugin extends Plugin {
    static name = "api/isHeadless";

    static level = LEVELS.MANDATORY;

    constructor() {
        super();
        this.addListener("BrowserType.launch:after",
                         this.#addIsHeadless.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #addIsHeadless(browser, { args }) {
        browser.isHeadless = () => {
            return args[0]?.headless ?? true;
        };

        return browser;
    }
}
