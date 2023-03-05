/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

/**
 * @typedef {import("playwright").Browser} Browser
 */

export default class BrowserPlugin extends Plugin {
    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "hook/browser";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.MANDATORY;

    /**
     * La liste des plugins.
     *
     * @type {Plugin[]}
     */
    #plugins = [];

    /**
     * Crée une instance du plugin.
     */
    constructor() {
        super();
        this.addHook(
            "BrowserType.launch:before",
            this.#storePlugins.bind(this),
        );
        this.addHook("BrowserType.launch:after", this.#hook.bind(this));
        this.addHook(
            "BrowserType.launchPersistentContext:before",
            this.#storePlugins.bind(this),
        );
        this.addHook(
            "BrowserType.launchPersistentContext:after",
            this.#hook.bind(this),
        );
    }

    /**
     * Enregistre la liste des plugins depuis les options.
     *
     * @template {any[]} T Les types des paramètres.
     * @param {T}      args           Les paramètres qui contiennent les
     *                                options.
     * @param {Object} context        Le contexte de la méthode.
     * @param {string} context.method Le nom de la méthode avec son objet.
     * @returns {T} Les mêmes paramètres.
     */
    #storePlugins(args, { method }) {
        this.#plugins =
            "BrowserType.launch" === method ? args[0].plugins : args[1].plugins;
        return args;
    }

    /**
     * Ajoute les plugins dans le <code>Browser</code> de Playwright.
     *
     * @param {Browser} browser Le <code>Browser</code> vanilla.
     * @returns {Browser} Le <code>Browser</code> avec les plugins.
     */
    #hook(browser) {
        return hook(browser, this.#plugins);
    }
}
