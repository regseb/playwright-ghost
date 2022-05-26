/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class BrowserTypePlugin extends Plugin {
    static name = "api/browserType";

    static level = LEVELS.MANDATORY;

    constructor() {
        super();
        this.addListener("BrowserType.launch:after",
                         this.#addBrowserType.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #addBrowserType(browser, { obj }) {
        // Ajouter une méthode pour avoir le type du navigateur en attendant
        // qu'elle soit implémentée directement dans Playwright.
        // https://github.com/microsoft/playwright/issues/13882
        Object.defineProperty(browser, "browserType", {
            value() {
                return obj;
            },
        });

        return browser;
    }
}
