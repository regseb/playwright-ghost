/**
 * @module
 */

import playwright from "playwright";
import hook from "./hook.js";
import InitScriptPlugin from "./plugin/meta/initscript.js";
import PLUGINS from "./plugin/index.js";
import LEVELS from "./plugin/levels.js";

const load = function (options = {}) {
    const pluginNames = new Set(PLUGINS.map((p) => p.name));
    const unknowns = Object.keys(options)
                           .filter((r) => "*" !== r &&
                                          "extra" !== r &&
                                          !pluginNames.has(r));
    if (0 !== unknowns.length) {
        throw new Error(`Plugins unknown: ${unknowns.join(", ")}`);
    }

    const plugins = PLUGINS.map((Plugin) => {
        if (LEVELS.MANDATORY === Plugin.level) {
            return new Plugin();
        }
        if (Plugin.name in options) {
            if (true === options[Plugin.name]) {
                return new Plugin();
            }
            if (false !== options[Plugin.name]) {
                return new Plugin(options[Plugin.name]);
            }
            return undefined;
        }
        if ("*" in options) {
            return options["*"] ? new Plugin()
                                : undefined;
        }
        return LEVELS.ENABLED === Plugin.level ? new Plugin()
                                               : undefined;
    }).filter((p) => undefined !== p);

    // Ajouter les éventuels plugins de l'utilisateur.
    plugins.push(...options.extra ?? []);

    // Regrouper les méthodes addInitScript().
    plugins.push(new InitScriptPlugin(plugins));

    return plugins;
};

const plug = function (browserType) {
    return hook(browserType, [{
        before(args, { obj, prop }) {
            if ("launch" !== prop) {
                return args;
            }

            const plugins = load(args[0]?.plugins);
            return plugins.reduce((a, p) => p.before(a, { obj, prop }),
                                  [{ ...args[0], plugins }]);
        },

        after(returnValue, { obj, prop, args }) {
            if ("launch" !== prop) {
                return returnValue;
            }

            return args[0].plugins.reduce((r, p) => {
                return p.after(r, { obj, prop, args });
            }, returnValue);
        },
    }]);
};

export const chromium = plug(playwright.chromium);
export const firefox = plug(playwright.firefox);
export default { chromium, firefox };
