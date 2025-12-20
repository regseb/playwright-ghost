/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import crypto from "node:crypto";

/**
 * Espace de nom fournissant des fonctions pour générer des données aléatoires.
 * Les fonctions sont inspirées de la proposition _Simple Random Functions_ au
 * TC39.
 *
 * @see https://github.com/tc39/proposal-random-functions
 */
export default {
    /**
     * Génère un nombre flottant aléatoire entre 0 (inclus) et 1 (exclus).
     *
     * @returns {number} Le nombre flottant généré.
     * @see https://github.com/tc39/proposal-random-functions#randomrandomoptions-randomoptions-number
     */
    random() {
        return Math.random();
    },

    /**
     * Génère un nombre flottant aléatoire entre `lo` et `hi`.
     *
     * @param {number} lo La limite inférieure (incluse).
     * @param {number} hi La limite supérieure (exclue).
     * @returns {number} Le nombre flottant généré.
     * @see https://github.com/tc39/proposal-random-functions#randomnumberlo-number-hi-number-steporoptions-number-or-randomoptions-number
     */
    number(lo, hi) {
        return Math.random() * (hi - lo) + lo;
    },

    /**
     * Génère un nombre entier aléatoire entre `lo` et `hi`.
     *
     * @param {number} lo La limite inférieure (incluse).
     * @param {number} hi La limite supérieure (incluse).
     * @returns {number} Le nombre entier aléatoire généré.
     * @see https://github.com/tc39/proposal-random-functions#randomintlo-number-hi-number-steporoptions-number-or-randomoptions-number
     */
    int(lo, hi) {
        return crypto.randomInt(lo, hi + 1);
    },
};
