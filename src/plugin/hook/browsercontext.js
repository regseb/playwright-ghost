/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

/**
 * @typedef {import("playwright").BrowserContext} BrowserContext
 */

export default class BrowserContextPlugin extends Plugin {
    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "hook/browserContext";

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
        this.addHook(
            "BrowserType.launchPersistentContext:before",
            this.#storePlugins.bind(this),
        );
        this.addHook("Browser.newContext:after", this.#hook.bind(this));
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
     * Ajoute les plugins dans le <code>BrowserContext</code> de Playwright.
     *
     * @param {BrowserContext} context Le <code>BrowserContext</code> vanilla.
     * @returns {BrowserContext} Le <code>BrowserContext</code> avec les
     *                           plugins.
     */
    #hook(context) {
        return hook(context, this.#plugins);
    }
}
