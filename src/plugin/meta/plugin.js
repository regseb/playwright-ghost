/**
 * @module
 */

export default class Plugin {

    static light(key, listener) {
        const plugin = new Plugin();
        plugin.addListener(key, listener);
        return plugin;
    }

    #listeners = {};

    addListener(key, listener) {
        this.#listeners[key] = listener;
    }

    before(args, { obj, prop }) {
        const key = `${obj.constructor.name}.${prop}:before`;
        return key in this.#listeners
            ? this.#listeners[key](args, { obj, prop })
            : args;
    }

    after(returnValue, { obj, prop, args }) {
        const key = `${obj.constructor.name}.${prop}:after`;
        if (key in this.#listeners) {
            if ("then" in returnValue) {
                // Ne pas utiliser un await pour ne pas rendre toute la fonction
                // async.
                // eslint-disable-next-line promise/prefer-await-to-then
                return returnValue.then((r) => {
                    return this.#listeners[key](r, { obj, prop, args });
                });
            }
            return this.#listeners[key](returnValue, { obj, prop, args });
        }
        return returnValue;
    }

    // eslint-disable-next-line class-methods-use-this
    addInitScript() {
        return undefined;
    }
}
