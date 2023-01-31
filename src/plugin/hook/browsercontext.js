/**
 * @module
 */

import hook from "../../hook.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class BrowserContextPlugin extends Plugin {
    static name = "hook/browserContext";

    static level = LEVELS.MANDATORY;

    #plugins;

    constructor() {
        super();
        this.addListener("BrowserType.launch:before",
                         this.#storePlugins.bind(this));
        this.addListener("BrowserContext.newPage:after",
                         this.#hook.bind(this));
    }

    #storePlugins(args) {
        // Récupérer la liste des plugins maintenant pour pouvoir les ajouter
        // à la Page quand elle sera créée.
        this.#plugins = args[0].plugins;
        return args;
    }

    #hook(page) {
        return hook(page, this.#plugins);
    }
}
