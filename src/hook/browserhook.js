/**
 * @module
 */

import InitScriptPlugin from "../plugin/meta/initscriptplugin.js";
import trace from "../trace.js";
import BrowserContextHook from "./browsercontexthook.js";
import Hook from "./hook.js";

export default class BrowserHook extends Hook {

    constructor(plugins) {
        super(plugins);
        this.plugins.push(plugins);
    }

    async Browser_newContext_after(browserContextPromise) {
        return trace(await browserContextPromise,
                     new BrowserContextHook(this.plugins));
    }

    after(object, property, args, returnValue) {
        const name = `${object.constructor.name}_${property}_after`;

        const plugins = this.plugins.slice();
        if ("newContext" === property) {
            plugins.push({ [name]: InitScriptPlugin.merge(this.plugins) });
        }

        return plugins.filter((p) => undefined !== p[name])
                      .reduce((r, p) => p[name](r, object, args),
                                   returnValue);
    }
}
