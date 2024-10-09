/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Attend un certain temps.
 *
 * @param {number} timeout Le temps d'attente en millisecondes.
 * @returns {Promise<void>} Une promesse remplie après le délai.
 */
export default function wait(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}
