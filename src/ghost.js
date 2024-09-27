/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "./hook.js";
import browserPlugin from "./plugins/hook/browser.js";
import browserContextPlugin from "./plugins/hook/browsercontext.js";
import locatorPlugin from "./plugins/hook/locator.js";
import pagePlugin from "./plugins/hook/page.js";

/**
 * @import { Browser, BrowserContext, BrowserType } from "playwright"
 */

const REGEXP = /^(?<obj>\w+)\.(?<prop>\w+):(?<temporality>after|before)$/u;

const NEW_MAPPINGS = {
    "Browser:new": Object.entries({
        "BrowserType.launch:after": (l) => async (r, c) => l(await r, c),
    }),
    "BrowserContext:new": Object.entries({
        "BrowserType.launchPersistentContext:after": (l) => async (r, c) =>
            l(await r, c),
        "Browser.newContext:after": (l) => async (r, c) => l(await r, c),
    }),
    "Page:new": Object.entries({
        "Browser.newPage:after": (l) => async (r, c) => l(await r, c),
        "BrowserContext.newPage:after": (l) => async (r, c) => l(await r, c),
    }),
    "Locator:new": Object.entries({
        "Page.getByRole:after": (l) => l,
        "Page.getByText:after": (l) => l,
        "Page.getByLabel:after": (l) => l,
        "Page.getByPlaceholder:after": (l) => l,
        "Page.getByAltText:after": (l) => l,
        "Page.getByTitle:after": (l) => l,
        "Page.getByTestId:after": (l) => l,
        "Page.locator:after": (l) => l,
        "Locator.all:after": (l) => async (r, c) =>
            // eslint-disable-next-line unicorn/no-await-expression-member
            (await r).map((s) => l(s, c)),
        "Locator.and:after": (l) => l,
        "Locator.filter:after": (l) => l,
        "Locator.first:after": (l) => l,
        "Locator.getByRole:after": (l) => l,
        "Locator.getByText:after": (l) => l,
        "Locator.getByLabel:after": (l) => l,
        "Locator.getByPlaceholder:after": (l) => l,
        "Locator.getByAltText:after": (l) => l,
        "Locator.getByTitle:after": (l) => l,
        "Locator.getByTestId:after": (l) => l,
        "Locator.last:after": (l) => l,
        "Locator.locator:after": (l) => l,
        "Locator.nth:after": (l) => l,
        "Locator.or:after": (l) => l,
    }),
};

const dispatch = (plugins) => {
    const listeners = new Map();
    plugins
        .flatMap((p) => Object.entries(p))
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
    launch(options) {
        const listeners = dispatch([
            browserPlugin(),
            browserContextPlugin(),
            pagePlugin(),
            locatorPlugin(),
            ...(options?.plugins ?? []),
        ]);
        const hooked = hook(this.#browserType, listeners.get("BrowserType"), {
            listeners,
        });
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
    launchPersistentContext(userDataDir, options) {
        const listeners = dispatch([
            browserPlugin(),
            browserContextPlugin(),
            pagePlugin(),
            locatorPlugin(),
            ...(options?.plugins ?? []),
        ]);
        const hooked = hook(this.#browserType, listeners.get("BrowserType"), {
            listeners,
        });
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
