/**
 * @module
 * @license MIT
 * @see https://github.com/ghostery/adblocker
 * @author Sébastien Règne
 */

import { PlaywrightBlocker } from "@ghostery/adblocker-playwright";

/**
 * @import { Caching, Config } from "@ghostery/adblocker-playwright"
 * @import { Page } from "playwright"
 */

/**
 * @typedef {Object} ParseOptions Les options du mode `"parse"`.
 * @prop {'parse'}         mode     Le mode de chargement des règles.
 * @prop {string}          filters  Les filtres.
 * @prop {Partial<Config>} [config] L'éventuelle configuration.
 */

/**
 * @typedef {Object} FromListsOptions Les options du mode `"fromLists"`.
 * @prop {'fromLists'}     mode      Le mode de chargement des règles.
 * @prop {string[]}        urls      Les URLs.
 * @prop {typeof fetch}    [fetch]   L'éventuelle fonction pour faire des
 *                                   requêtes.
 * @prop {Partial<Config>} [config]  L'éventuelle configuration.
 * @prop {Caching}         [caching] L'éventuel système de cache.
 */

/**
 * @typedef {Object} FromPrebuiltOptions Les options des modes
 *                                       `"fromPrebuiltAdsOnly"`,
 *                                       `"fromPrebuiltAdsAndTracking"` et
 *                                       `"fromPrebuiltFull"`.
 * @prop {'fromPrebuiltAdsOnly' | 'fromPrebuiltAdsAndTracking' | 'fromPrebuiltFull'} mode      Le
 *                                                                                             mode
 *                                                                                             de
 *                                                                                             chargement
 *                                                                                             des
 *                                                                                             règles.
 * @prop {typeof fetch}                                                              [fetch]   L'éventuelle
 *                                                                                             fonction
 *                                                                                             pour
 *                                                                                             faire
 *                                                                                             des
 *                                                                                             requêtes.
 * @prop {Caching}                                                                   [caching] L'éventuel
 *                                                                                             système
 *                                                                                             de
 *                                                                                             cache.
 */

/**
 * @typedef {ParseOptions | FromListsOptions | FromPrebuiltOptions} UtilsAdblockerOptions Les
 *                                                                                        options
 *                                                                                        du
 *                                                                                        plugin
 *                                                                                        `utils.adblocker`.
 */

/**
 * Crée un plugin pour ajouter un bloqueur de publicités dans le navigateur.
 *
 * @param {UtilsAdblockerOptions} [options] Les éventuelles options du plugin
 *                                          `utils.adblocker`.
 * @returns {Promise<Record<string, Function>>} Une promesse contenant le
 *                                              crochet du plugin.
 */
export default async function utilsAdblockerPlugin(options) {
    let blocker;
    switch (options?.mode) {
        case "parse":
            blocker = PlaywrightBlocker.parse(options.filters, options.config);
            break;
        case "fromLists":
            blocker = await PlaywrightBlocker.fromLists(
                options.fetch ?? fetch,
                options.urls,
                options.config,
                options.caching,
            );
            break;
        case "fromPrebuiltAdsOnly":
            blocker = await PlaywrightBlocker.fromPrebuiltAdsOnly(
                options.fetch,
                options.caching,
            );
            break;
        case undefined:
        case "fromPrebuiltAdsAndTracking":
            blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(
                options?.fetch,
                options?.caching,
            );
            break;
        case "fromPrebuiltFull":
            blocker = await PlaywrightBlocker.fromPrebuiltFull(
                options.fetch,
                options.caching,
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
