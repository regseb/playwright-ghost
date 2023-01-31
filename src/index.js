/**
 * @module
 */

import playwright from "playwright";
import hook from "./hook.js";
import PLUGINS from "./plugin/index.js";
import LEVELS from "./plugin/levels.js";
import InitScriptPlugin from "./plugin/meta/initscriptplugin.js";
import Plugin from "./plugin/meta/plugin.js";

const load = function (options = {}) {
    let defaultOptions = {};
    const clazzs = new Map();
    for (const Clazz of PLUGINS) {
        defaultOptions = {
            ...defaultOptions,
            [Clazz.name]: LEVELS.ENABLED === Clazz.level,
        };
        clazzs.set(Clazz.name, Clazz);
    }
    for (const Clazz of options.import?.flat() ?? []) {
        // TODO Vérifier qu'il n'y a pas de doublons.
        defaultOptions = {
            ...defaultOptions,
            [Clazz.name]: LEVELS.ENABLED === Clazz.level,
        };
        clazzs.set(Clazz.name, Clazz);
    }

    const plugins = Object.entries({ ...defaultOptions,
                                     ...options }).map(([key, value]) => {
        if ("import" === key) {
            return undefined;
        }
        if (key.startsWith("x/")) {
            if (!(value instanceof Plugin)) {
                throw new TypeError("Custom plugin must extends Plugin: " +
                                    key);
            }
            return value;
        }
        const Clazz = clazzs.get(key);
        if (undefined === Clazz) {
            throw new Error(`Plugin unknown: ${key}`);
        }
        if (LEVELS.MANDATORY === Clazz.level) {
            return new Clazz();
        }
        switch (value) {
            case true:  return new Clazz();
            case false: return undefined;
            default:    return new Clazz(value);
        }
    }).filter((p) => undefined !== p);

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
