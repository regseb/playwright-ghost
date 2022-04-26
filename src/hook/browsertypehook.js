/**
 * @module
 */

import trace from "../trace.js";
import plugins from "../plugin/index.js";
import BrowserHook from "./browserhook.js";
import Hook from "./hook.js";

export default class BrowserTypeHook extends Hook {

    async #traceBrowser(browserPromise) {
        return trace(await browserPromise, new BrowserHook(this.plugins));
    }

    before(object, property, args) {
        if ("launch" === property) {
            const optionsPlugins = args[0]?.plugins ?? {};
            for (const Plugin of plugins) {
                if (Plugin.mandatory) {
                    this.plugins.push(new Plugin());
                } else if (Plugin.name in optionsPlugins &&
                        false !== optionsPlugins[Plugin.name]) {
                    this.plugins.push(new Plugin(optionsPlugins[Plugin.name]));
                } else if (!(Plugin.name in optionsPlugins) &&
                        false !== optionsPlugins["*"]) {
                    this.plugins.push(new Plugin());
                }
            }
        }
        return super.before(object, property, args);
    }

    after(object, property, args, returnValue) {
        if ("launch" === property) {
            returnValue = this.#traceBrowser(returnValue);
        }
        return super.after(object, property, args, returnValue);
    }
}
