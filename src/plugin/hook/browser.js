/**
 * @module
 */

import hook from "../../hook.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

export default class BrowserPlugin extends Plugin {
    static name = "hook/browser";

    static level = LEVELS.MANDATORY;

    #plugins;

    constructor() {
        super();
        this.addListener("BrowserType.launch:before",
                         this.#storePlugins.bind(this));
        this.addListener("Browser.newContext:after",
                         this.#hook.bind(this));
    }

    #storePlugins(args) {
        // Récupérer la liste des plugins maintenant pour pouvoir les ajouter
        // au BrowserContext quand il sera créé.
        this.#plugins = args[0].plugins;
        return args;
    }

    #hook(context) {
        return hook(context, this.#plugins);
    }
}
