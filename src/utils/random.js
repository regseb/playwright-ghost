/**
 * @module
 */

/**
 * Retourne un nombre entier aléatoire.
 *
 * @param {number} min La valeur minimum.
 * @param {number} max La valeur maximum.
 * @returns {number} Le nombre aléatoire.
 */
export const getInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

export default { getInt };
