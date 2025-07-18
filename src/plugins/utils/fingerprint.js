/**
 * @module
 * @license MIT
 * @see https://github.com/apify/fingerprint-suite
 * @author Sébastien Règne
 */

import { FingerprintGenerator } from "fingerprint-generator";
import { FingerprintInjector } from "fingerprint-injector";

/**
 * @import {
 *     BrowserFingerprintWithHeaders,
 *     FingerprintGeneratorOptions,
 * } from "fingerprint-generator"
 * @import { Browser, BrowserContext, BrowserType } from "playwright"
 * @import { ContextAfter, ContextBefore } from "../../hook.js"
 */

/**
 * Modifie les informations dans les options pour le _fingerprint_ et les
 * entêtes.
 *
 * @param {Record<string, any>|undefined} options                Les options de
 *                                                               création d'un
 *                                                               `BrowserContext`.
 * @param {BrowserFingerprintWithHeaders} fingerprintWithHeaders Le
 *                                                               _fingerprint_
 *                                                               et les entêtes.
 * @returns {Record<string, any>} Les nouvelles options.
 */
const setFingerprint = (options, { fingerprint, headers }) => {
    // Reprendre le code source de la fonction newInjectedContext. On ne peut
    // pas utiliser cette fonction, car elle remplace la méthode
    // Browser.newContext(). Les plugins permettent seulement de modifier les
    // arguments et la valeur de retour.
    // https://github.com/apify/fingerprint-suite/blob/v2.1.69/packages/fingerprint-injector/src/fingerprint-injector.ts#L331
    return {
        userAgent: fingerprint.navigator.userAgent,
        colorScheme: "dark",
        ...options,
        viewport: {
            width: fingerprint.screen.width,
            height: fingerprint.screen.height,
            ...options?.viewport,
        },
        extraHTTPHeaders: {
            "accept-language": headers["accept-language"],
            ...options?.extraHTTPHeaders,
        },
    };
};

/**
 * @typedef {Object} UtilsFingerprintOptions Les options du plugin
 *                                           `utils.fingerprint`.
 * @prop {BrowserFingerprintWithHeaders}        [fingerprint]        La
 *                                                                   propriété
 *                                                                   `fingerprint`
 *                                                                   de la
 *                                                                   fonction
 *                                                                   `newInjectedContext()`.
 * @prop {Partial<FingerprintGeneratorOptions>} [fingerprintOptions] La
 *                                                                   propriété
 *                                                                   `fingerprintOptions`
 *                                                                   de la
 *                                                                   fonction
 *                                                                   `newInjectedContext()`.
 */

/**
 * Crée un plugin pour modifier le _fingerprint_ du navigateur.
 *
 * @param {UtilsFingerprintOptions} [options] Les éventuelles options du plugin
 *                                            `utils.fingerprint`.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function utilsFingerprintPlugin(options) {
    const fingerprint = options?.fingerprint;
    const fingerprintOptions = options?.fingerprintOptions;

    /**
     * Le magasin des _fingerprints_ et des entêtes échangés entre le crochet
     * d'avant et d'après.
     *
     * @type {Map<string, BrowserFingerprintWithHeaders>}
     */
    const store = new Map();

    return {
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (args, { id }) => {
            const fingerprintWithHeaders =
                fingerprint ??
                new FingerprintGenerator().getFingerprint(fingerprintOptions);
            store.set(id, fingerprintWithHeaders);
            return [args[0], setFingerprint(args[1], fingerprintWithHeaders)];
        },

        /**
         * Modifie le contexte créé.
         *
         * @param {BrowserContext}            browserContext Le contexte qui
         *                                                   sera modifié.
         * @param {ContextAfter<BrowserType>} context        Le contexte du
         *                                                   crochet.
         * @returns {Promise<BrowserContext>} Le contexte modifié.
         */
        "BrowserType.launchPersistentContext:after": async (
            browserContext,
            { id },
        ) => {
            const fingerprintWithHeaders =
                /** @type {BrowserFingerprintWithHeaders} */ (store.get(id));
            store.delete(id);
            await new FingerprintInjector().attachFingerprintToPlaywright(
                browserContext,
                fingerprintWithHeaders,
            );
            return browserContext;
        },

        /**
         * Modifie les options de création d'un contexte.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Browser>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newContext:before": (args, { id }) => {
            const fingerprintWithHeaders =
                fingerprint ??
                new FingerprintGenerator().getFingerprint(fingerprintOptions);
            store.set(id, fingerprintWithHeaders);
            return [setFingerprint(args[0], fingerprintWithHeaders)];
        },

        /**
         * Modifie le contexte créé.
         *
         * @param {BrowserContext}        browserContext Le contexte qui sera
         *                                               modifié.
         * @param {ContextAfter<Browser>} context        Le contexte du crochet.
         * @returns {Promise<BrowserContext>} Le contexte modifié.
         */
        "Browser.newContext:after": async (browserContext, { id }) => {
            const fingerprintWithHeaders =
                /** @type {BrowserFingerprintWithHeaders} */ (store.get(id));
            store.delete(id);
            await new FingerprintInjector().attachFingerprintToPlaywright(
                browserContext,
                fingerprintWithHeaders,
            );
            return browserContext;
        },
    };
}
