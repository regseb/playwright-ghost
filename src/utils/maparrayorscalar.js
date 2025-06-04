/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Exécute une fonction sur un élément ou une liste d'éléments.
 *
 * @param {any|any[]} value      Élément ou liste d'éléments.
 * @param {Function}  callbackFn Fonction à exécuter sur chaque élément.
 * @returns {any|any[]} Résultat de la fonction sur l'élément ou la liste
 *                      d'éléments.
 */
export default function mapArrayOrScalar(value, callbackFn) {
    return Array.isArray(value) ? value.map(callbackFn) : callbackFn(value);
}
