/**
 * @module
 */

import { dispatchAfter, dispatchBefore } from "../../hook.js";
import PLUGINS from "../index.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

/**
 * @typedef {import("playwright").BrowserType} BrowserType
 */

const load = function (options = {}) {
    let defaultOptions = {};
    const clazzs = new Map();
    for (const Clazz of PLUGINS) {
        defaultOptions = {
            ...defaultOptions,
            [Clazz.key]: LEVELS.ENABLED === Clazz.level,
        };
        clazzs.set(Clazz.key, Clazz);
    }
    for (const Clazz of options.import?.flat() ?? []) {
        // TODO Vérifier qu'il n'y a pas de doublons.
        defaultOptions = {
            ...defaultOptions,
            [Clazz.key]: LEVELS.ENABLED === Clazz.level,
        };
        clazzs.set(Clazz.key, Clazz);
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

    return plugins;
};

export default class BrowserTypePlugin extends Plugin {

    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "hook/browserType";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.MANDATORY;

    /**
     * Crée une instance du plugin.
     */
    constructor() {
        super();
        this.addHook("BrowserType.launch:before",
                     this.#beforeOfLaunch.bind(this));
        this.addHook("BrowserType.launch:after",
                     this.#afterOfLaunch.bind(this));
        this.addHook("BrowserType.launchPersistentContext:before",
                     this.#beforeOfLaunchPersistentContext.bind(this));
        this.addHook("BrowserType.launchPersistentContext:after",
                     this.#afterOfLaunchPersistentContext.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #beforeOfLaunch(args, { obj, method }) {
        const plugins = load(args[0]?.plugins);
        return dispatchBefore([{ ...args[0], plugins }],
                              { obj, method, plugins });
    }

    // eslint-disable-next-line class-methods-use-this
    #afterOfLaunch(returnValue, { obj, method, args }) {
        return dispatchAfter(returnValue, {
            obj,
            method,
            args,
            plugins: args[0].plugins,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    #beforeOfLaunchPersistentContext(args, { obj, method }) {
        const plugins = load(args[1]?.plugins);
        return dispatchBefore([args[0], { ...args[1], plugins }],
                              { obj, method, plugins });
    }

    // eslint-disable-next-line class-methods-use-this
    #afterOfLaunchPersistentContext(returnValue, { obj, method, args }) {
        return dispatchAfter(returnValue, {
            obj,
            method,
            args,
            plugins: args[1].plugins,
        });
    }
}
