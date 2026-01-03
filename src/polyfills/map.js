/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// @ts-expect-error
if (undefined === Map.prototype.getOrInsert) {
    /**
     * Renvoie la valeur correspondant à la clé. Si la clé n'est pas présente,
     * une nouvelle entrée est insérée avec la clé et la valeur par défaut
     * donnée, puis renvoie la valeur insérée.
     *
     * @template {any} T Le type des valeurs.
     * @param {any} key          La clé.
     * @param {T}   defaultValue La valeur par défaut.
     * @returns {T} La valeur associée à la clé.
     * @see https://developer.mozilla.org/Web/JavaScript/Reference/Global_Objects/Map/getOrInsert
     */
    // eslint-disable-next-line no-extend-native
    Map.prototype.getOrInsert = function getOrInsert(key, defaultValue) {
        if (this.has(key)) {
            return this.get(key);
        }
        this.set(key, defaultValue);
        return defaultValue;
    };
}

// @ts-expect-error
if (undefined === Map.prototype.getOrInsertComputed) {
    /**
     * Renvoie la valeur correspondant à la clé. Si la clé n'est pas présente,
     * une nouvelle entrée est insérée avec la clé et la valeur par défaut
     * calculée, puis renvoie la valeur insérée.
     *
     * @template {any} K Le type des clés.
     * @template {any} V Le type des valeurs.
     * @param {K}             key      La clé.
     * @param {(key: K) => V} callback La fonction pour calculer la valeur par
     *                                 défaut.
     * @returns {V} La valeur associée à la clé.
     * @see https://developer.mozilla.org/Web/JavaScript/Reference/Global_Objects/Map/getOrInsert
     */
    // eslint-disable-next-line no-extend-native
    Map.prototype.getOrInsertComputed = function getOrInsertComputed(
        key,
        callback,
    ) {
        if (this.has(key)) {
            return this.get(key);
        }
        // eslint-disable-next-line n/callback-return
        const defaultValue = callback(key);
        this.set(key, defaultValue);
        return defaultValue;
    };
}
