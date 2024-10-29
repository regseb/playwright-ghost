/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Aplatit une valeur en un tableau.
 *
 * @param {any} value La valeur à aplatir.
 * @returns {Promise<any[]>} Une promesse contenant le tableau aplatit.
 */
export default async function flatAwait(value) {
    const v = await value;
    if (!Array.isArray(v)) {
        return [v];
    }

    return v.reduce(async (flatten, cur) => {
        const f = await flatten;
        return f.concat(await flatAwait(cur));
    }, Promise.resolve([]));
}
