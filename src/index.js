/**
 * @module
 */

import playwright from "playwright";
import hook from "./hook.js";
import InitScriptPlugin from "./plugin/meta/initscript.js";
import PLUGINS from "./plugin/index.js";
import LEVELS from "./plugin/levels.js";

const normalize = function (rotten = {}) {
    const pluginNames = new Set(PLUGINS.map((p) => p.name));
    const unknowns = Object.keys(rotten)
                           .filter((r) => "*" !== r && !pluginNames.has(r));
    if (0 !== unknowns.length) {
        throw new Error(`Plugins unknown: ${unknowns.join(", ")}`);
    }
    return Object.fromEntries(PLUGINS.map((Plugin) => {
        if (LEVELS.MANDATORY === Plugin.level) {
            return [Plugin.name, true];
        }
        if (Plugin.name in rotten) {
            return [Plugin.name, rotten[Plugin.name]];
        }
        if ("*" in rotten) {
            return [Plugin.name, rotten["*"]];
        }
        return [Plugin.name, LEVELS.ENABLED === Plugin.level];
    }));
};

const plug = function (browserType) {
    return hook(browserType, [{
        before(args, { obj, prop }) {
            if ("launch" !== prop) {
                return args;
            }

            const options = normalize(args[0]?.plugins);
            const plugins = [];
            for (const [name, config] of Object.entries(options)) {
                const Plugin = PLUGINS.find((P) => name === P.name);
                if (true === config) {
                    plugins.push(new Plugin());
                } else if (false !== config) {
                    plugins.push(new Plugin(config));
                }
            }
            // Regrouper les méthodes addInitScript().
            plugins.push(new InitScriptPlugin(plugins));

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

export const firefox = plug(playwright.firefox);
export const chromium = plug(playwright.chromium);
export const vanilla = playwright;
