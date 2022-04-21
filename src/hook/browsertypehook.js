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
            for (const Plugin of plugins) {
                if (Plugin.mandatory) {
                    this.plugins.push(new Plugin());
                } else {
                    const options = args[0]?.plugins?.[Plugin.name];
                    if (false !== options) {
                        this.plugins.push(new Plugin(options));
                    }
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
