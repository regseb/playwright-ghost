/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

/**
 * @typedef {import("playwright").Browser} Browser
 */

export default class IsHeadlessPlugin extends Plugin {
    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "api/isHeadless";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.MANDATORY;

    constructor() {
        super();
        this.addHook(
            "BrowserType.launch:after",
            this.#addIsHeadless.bind(this),
        );
        this.addHook(
            "BrowserType.launchPersistentContext:after",
            this.#addIsHeadless.bind(this),
        );
    }

    /**
     * Ajoute une méthode qui indique si le navigateur est mode headless.
     *
     * @param {Browser} browser        Le <code>Browser</code>.
     * @param {Object}  context        Le contexte de la méthode.
     * @param {string}  context.method Le nom de la méthode avec son objet.
     * @param {any[]}   context.args   Les paramètres de la méthode.
     * @returns {Browser} Le <code>Browser</code> avec la nouvelle méthode.
     */
    // eslint-disable-next-line class-methods-use-this
    #addIsHeadless(browser, { method, args }) {
        const options = "BrowserType.launch" === method ? args[0] : args[1];
        // eslint-disable-next-line no-param-reassign
        browser.isHeadless = () => {
            return options?.headless ?? true;
        };

        return browser;
    }
}
