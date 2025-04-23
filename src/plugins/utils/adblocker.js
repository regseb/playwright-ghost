/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Page } from "playwright"
 */

/**
 * @typedef {Object} AdblockOptions Les options du plugin `utils.adblocker`.
 * @prop {string}   [mode]    Le mode de chargement des règles : `"parse"`,
 *                            `"fromLists"`, `"fromPrebuiltAdsOnly"`,
 *                            `"fromPrebuiltAdsAndTracking"`,
 *                            `"fromPrebuiltFull"`.
 * @prop {string}   [filters] Les filtres du mode `"parse"`.
 * @prop {Object}   [config]  La configuration des modes `"parse"` et
 *                            `"fromLists"`.
 * @prop {fetch}    [fetch]   La fonction pour faire des requêtes des modes
 *                            `"fromLists"`, `"fromPrebuiltAdsOnly"`,
 *                            `"fromPrebuiltAdsAndTracking"` et
 *                            `"fromPrebuiltFull"`.
 * @prop {string[]} [urls]    Les URLs du mode `"fromLists"`.
 */

/**
 * Crée un plugin pour ajouter un bloqueur de publicités dans le navigateur.
 *
 * @param {AdblockOptions} [options] Les éventuelles options du plugin
 *                                   `utils.adblocker`.
 * @returns {Promise<Record<string, Function>>} Une promesse contenant le
 *                                              crochet du plugin.
 */
export default async function adblockerPlugin(options) {
    const { PlaywrightBlocker } = await import(
        "@ghostery/adblocker-playwright"
    );

    let blocker;
    switch (options?.mode) {
        case "parse":
            blocker = PlaywrightBlocker.parse(
                options?.filters,
                options?.config,
            );
            break;
        case "fromLists":
            blocker = await PlaywrightBlocker.fromLists(
                options?.fetch ?? fetch,
                options?.urls,
                options?.config,
            );
            break;
        case "fromPrebuiltAdsOnly":
            blocker = await PlaywrightBlocker.fromPrebuiltAdsOnly(
                options?.fetch ?? fetch,
            );
            break;
        case undefined:
        case "fromPrebuiltAdsAndTracking":
            blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(
                options?.fetch ?? fetch,
            );
            break;
        case "fromPrebuiltFull":
            blocker = await PlaywrightBlocker.fromPrebuiltFull(
                options?.fetch ?? fetch,
            );
            break;
        default:
            throw new TypeError("invalid mode");
    }

    return {
        /**
         * Ajoute le bloqueur de publicités dans la page.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Page} La page avec le bloqueur.
         */
        "Page:new": (page) => {
            blocker.enableBlockingInPage(page);
            return page;
        },
    };
}
