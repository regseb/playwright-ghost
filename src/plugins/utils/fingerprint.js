/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Browser, BrowserContext, BrowserType } from "playwright"
 * @import { ContextAfter, ContextBefore } from "../../hook.js"
 */

/**
 * Le symbole pour stocker les informations du _fingerprint_ et des entêtes.
 *
 * @type {symbol}
 */
const FINGERPRINT_WITH_HEADERS_SYMBOL = Symbol("fingerprintWithHeaders");

/**
 * Modifie les informations dans les options pour le _fingerprint_ et les
 * entêtes.
 *
 * @param {Record<string, any>|undefined} options                            Les
 *                                                                           options
 *                                                                           de
 *                                                                           création
 *                                                                           d'un
 *                                                                           `BrowserContext`.
 * @param {Object}                        fingerprintWithHeaders             Le
 *                                                                           _fingerprint_
 *                                                                           et
 *                                                                           les
 *                                                                           entêtes.
 * @param {Object}                        fingerprintWithHeaders.fingerprint Le
 *                                                                           _fingerprint_.
 * @param {Object}                        fingerprintWithHeaders.headers     Les
 *                                                                           entêtes.
 * @returns {Record<string, any>} Les nouvelles options.
 */
const setFingerprint = (options, { fingerprint, headers }) => {
    // Reprendre le code source de la fonction newInjectedContext. On ne peut
    // utiliser cette fonction, car elle remplace la méthode
    // Browser.newContext(). Les plugins permettent seulement de modifier les
    // arguments et le retour.
    // https://github.com/apify/fingerprint-suite/blob/v2.1.63/packages/fingerprint-injector/src/fingerprint-injector.ts#L322
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
 * Crée un plugin pour modifier le _fingerprint_ du navigateur.
 *
 * @param {Object} [options]                    Les options du plugin.
 * @param {Object} [options.fingerprint]        TODO
 * @param {Object} [options.fingerprintOptions] TODO
 * @returns {Promise<Record<string, Function>>} Une promesse contenant le
 *                                              crochet du plugin.
 */
export default async function fingerprintPlugin(options) {
    const { FingerprintGenerator } = await import("fingerprint-generator");
    const { FingerprintInjector } = await import("fingerprint-injector");

    const fingerprint = options?.fingerprint;
    const fingerprintOptions = options?.fingerprintOptions ?? {};

    return {
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (args, { store }) => {
            const fingerprintWithHeaders =
                fingerprint ??
                new FingerprintGenerator().getFingerprint(fingerprintOptions);
            // eslint-disable-next-line no-param-reassign
            store[FINGERPRINT_WITH_HEADERS_SYMBOL] = fingerprintWithHeaders;
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
            { store },
        ) => {
            const fingerprintWithHeaders =
                store[FINGERPRINT_WITH_HEADERS_SYMBOL];
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
        "Browser.newContext:before": (args, { store }) => {
            const fingerprintWithHeaders =
                fingerprint ??
                new FingerprintGenerator().getFingerprint(fingerprintOptions);
            // eslint-disable-next-line no-param-reassign
            store[FINGERPRINT_WITH_HEADERS_SYMBOL] = fingerprintWithHeaders;
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
        "Browser.newContext:after": async (browserContext, { store }) => {
            const fingerprintWithHeaders =
                store[FINGERPRINT_WITH_HEADERS_SYMBOL];
            await new FingerprintInjector().attachFingerprintToPlaywright(
                browserContext,
                fingerprintWithHeaders,
            );
            return browserContext;
        },
    };
}
