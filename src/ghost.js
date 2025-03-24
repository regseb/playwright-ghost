/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "./hook.js";
import browserPlugin from "./plugins/hook/browser.js";
import browserContextPlugin from "./plugins/hook/browsercontext.js";
import locatorPlugin from "./plugins/hook/locator.js";
import mousePlugin from "./plugins/hook/mouse.js";
import pagePlugin from "./plugins/hook/page.js";
import flatAwait from "./utils/flatawait.js";

/**
 * @import { Browser, BrowserContext, BrowserType, Frame, Page, Locator } from "playwright"
 * @import { ContextAfter, Listener } from "./hook.js"
 */

const REGEXP = /^(?<obj>\w+)\.(?<prop>\w+):(?<temporality>after|before)$/v;

/**
 * Renvoie l'objet passé en argument.
 *
 * @template T
 * @param {T} x Un objet quelconque.
 * @returns {T} Le même objet quelconque.
 */
const identity = (x) => x;

const NEW_MAPPINGS = {
    "Browser:new": Object.entries({
        "BrowserType.launch:after": identity,
    }),
    "BrowserContext:new": Object.entries({
        "BrowserType.launchPersistentContext:after": identity,
        "Browser.newContext:after": identity,
    }),
    "Page:new": Object.entries({
        "Browser.newPage:after": identity,
        "BrowserContext.newPage:after": identity,
    }),
    "Locator:new": Object.entries({
        "Page.getByRole:after": identity,
        "Page.getByText:after": identity,
        "Page.getByLabel:after": identity,
        "Page.getByPlaceholder:after": identity,
        "Page.getByAltText:after": identity,
        "Page.getByTitle:after": identity,
        "Page.getByTestId:after": identity,
        "Page.locator:after": identity,
        "Locator.all:after":
            (/** @type {Function} */ listener) =>
            (
                /** @type {Locator[]} */ locators,
                /** @type {ContextAfter<Locator>} */ context,
            ) =>
                locators.map((l) => listener(l, context)),
        "Locator.and:after": identity,
        "Locator.filter:after": identity,
        "Locator.first:after": identity,
        "Locator.getByRole:after": identity,
        "Locator.getByText:after": identity,
        "Locator.getByLabel:after": identity,
        "Locator.getByPlaceholder:after": identity,
        "Locator.getByAltText:after": identity,
        "Locator.getByTitle:after": identity,
        "Locator.getByTestId:after": identity,
        "Locator.last:after": identity,
        "Locator.locator:after": identity,
        "Locator.nth:after": identity,
        "Locator.or:after": identity,
    }),
    "Mouse:new": Object.entries({
        "Browser.newPage:after":
            (/** @type {Function} */ listener) =>
            (
                /** @type {Page} */ page,
                /** @type {ContextAfter<Browser>} */ context,
            ) => {
                // eslint-disable-next-line no-param-reassign
                page.mouse = listener(page.mouse, context);
                return page;
            },
        "BrowserContext.newPage:after":
            (/** @type {Function} */ listener) =>
            (
                /** @type {Page} */ page,
                /** @type {ContextAfter<BrowserContext>} */ context,
            ) => {
                // eslint-disable-next-line no-param-reassign
                page.mouse = listener(page.mouse, context);
                return page;
            },
    }),
};

/**
 * Répartit les crochets pour les regrouper par objet, propriété et temporalité.
 *
 * @param {Record<string, Function>[]} hooks La liste des crochets.
 * @returns {Map<string, Map<string, Listener>>} Les écouteurs regroupés par
 *                                               objet, propriété et
 *                                               temporalité.
 */
const dispatch = (hooks) => {
    const listeners = new Map();
    hooks
        .flatMap((h) => Object.entries(h))
        .flatMap(([key, listener]) => {
            return key in NEW_MAPPINGS
                ? NEW_MAPPINGS[key].map(([k, f]) => [k, f(listener)])
                : [[key, listener]];
        })
        .forEach(([key, listener]) => {
            const result = REGEXP.exec(key);
            const { obj, prop, temporality } = result.groups;
            if (!listeners.has(obj)) {
                listeners.set(obj, new Map());
            }
            if (!listeners.get(obj).has(prop)) {
                listeners.get(obj).set(prop, { before: [], after: [] });
            }
            listeners.get(obj).get(prop)[temporality].push(listener);
        });
    return listeners;
};

export default class Ghost {
    /**
     * Le `BrowserType` vanille de Playwright.
     *
     * @type {BrowserType}
     */
    #browserType;

    /**
     * Crée une version fantôme d'un `BrowserType` de Playwright
     *
     * @param {BrowserType} browserType Le `BrowserType` vanille de Playwright.
     */
    constructor(browserType) {
        this.#browserType = browserType;
    }

    /**
     * Récupère le chemin de l'exécutable du navigateur.
     *
     * @returns {string} Le chemin de l'exécutable.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-executable-path
     */
    executablePath() {
        return this.#browserType.executablePath();
    }

    /**
     * Lance une version fantôme d'un `Browser` de Playwright.
     *
     * @param {Record<string, any>} [options] Les options de création d'un
     *                                        `Browser`.
     * @returns {Promise<Browser>} Une promesse contenant la version fantôme du
     *                             `Browser`.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-launch
     */
    async launch(options) {
        const listeners = new Map();
        dispatch([
            browserPlugin(listeners),
            browserContextPlugin(listeners),
            pagePlugin(listeners),
            locatorPlugin(listeners),
            mousePlugin(listeners),
            ...(await flatAwait(options?.plugins ?? [])),
        ]).forEach((v, k) => listeners.set(k, v));

        const hooked = hook(this.#browserType, listeners.get("BrowserType"));
        return hooked.launch(options);
    }

    /**
     * Lance une version fantôme d'un `BrowserContext` de Playwright.
     *
     * @param {string}              userDataDir Le chemin vers le répertoire des
     *                                          données de session.
     * @param {Record<string, any>} [options]   Les options de création d'un
     *                                          `Browser` et de son
     *                                          `BrowserContext`.
     * @returns {Promise<BrowserContext>} Une promesse contenant la version
     *                                    fantôme du `BrowserContext`.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context
     */
    async launchPersistentContext(userDataDir, options) {
        const listeners = new Map();
        dispatch([
            browserPlugin(listeners),
            browserContextPlugin(listeners),
            pagePlugin(listeners),
            locatorPlugin(listeners),
            mousePlugin(listeners),
            ...(await flatAwait(options?.plugins ?? [])),
        ]).forEach((v, k) => listeners.set(k, v));

        const hooked = hook(this.#browserType, listeners.get("BrowserType"));
        return hooked.launchPersistentContext(userDataDir, options);
    }

    /**
     * Retourne le nom du type de navigateur. Par exemple : `chromium`, `webkit`
     * ou `firefox`.
     *
     * @returns {string} Le nom du type de navigateur.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-name
     */
    name() {
        return this.#browserType.name();
    }
}
