/**
 * @module
 */

export default class Plugin {

    static light(key, listener) {
        const plugin = new Plugin();
        plugin.addHook(key, listener);
        return plugin;
    }

    #hooks = new Map();

    /**
     * Ajoute un hook dans le plugin.
     *
     * @param {string}   key      Le nom de la méthode où le listener sera
     *                            ajouté.
     * @param {Function} listener La fonction appelée.
     */
    addHook(key, listener) {
        this.#hooks.set(key, [
            ...this.#hooks.get(key) ?? [],
            listener,
        ]);
    }

    /**
     * Retourne les listeners associés à une méthode.
     *
     * @param {string} key Le nom de la méthode.
     * @returns {Function[]} Les listeners.
     */
    getHooks(key) {
        return this.#hooks.get(key) ?? [];
    }
}
