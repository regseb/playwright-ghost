/**
 * @module
 */

import hook from "../../hook.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class BrowserTypePlugin extends Plugin {
    static name = "hook/browserType";

    static level = LEVELS.MANDATORY;

    #plugins;

    constructor() {
        super();
        this.addListener("BrowserType.launch:before",
                         this.#storePlugins.bind(this));
        this.addListener("BrowserType.launch:after",
                         this.#hook.bind(this));
    }

    #storePlugins(args) {
        // Récupérer la liste des plugins maintenant pour pouvoir les ajouter
        // au Browser quand il sera créé.
        this.#plugins = args[0].plugins;
        return args;
    }

    #hook(browser) {
        return hook(browser, this.#plugins);
    }
}
