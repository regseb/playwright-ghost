/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "./hook.js";
import BrowserHooker from "./hookers/browser.js";
import BrowserContextHooker from "./hookers/browsercontext.js";
import FrameHooker from "./hookers/frame.js";
import FrameLocatorHooker from "./hookers/framelocator.js";
import LocatorHooker from "./hookers/locator.js";
import MouseHooker from "./hookers/mouse.js";
import PageHooker from "./hookers/page.js";
import flatAwait from "./utils/flatawait.js";

/**
 * @import { Browser, BrowserContext, BrowserType } from "playwright"
 * @import { Listener } from "./hook.js"
 */

const REGEXP = /^(?<obj>\w+)\.(?<prop>\w+):(?<temporality>after|before)$/v;

const PRESETS = {
    "Browser:new": Object.entries(BrowserHooker.PRESETS),
    "BrowserContext:new": Object.entries(BrowserContextHooker.PRESETS),
    "Page:new": Object.entries(PageHooker.PRESETS),
    "Frame:new": Object.entries(FrameHooker.PRESETS),
    "Locator:new": Object.entries(LocatorHooker.PRESETS),
    "FrameLocator:new": Object.entries(FrameLocatorHooker.PRESETS),
    "Mouse:new": Object.entries(MouseHooker.PRESETS),
};

/**
 * Répartit les crochets pour les regrouper par objet, propriété et temporalité.
 *
 * @param {Record<string, Function>[]}         hooks     La liste des crochets.
 * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 */
const dispatch = (hooks, listeners) => {
    hooks
        .flatMap((h) => Object.entries(h))
        .flatMap(([key, listener]) => {
            return key in PRESETS
                ? PRESETS[key].map(([k, f]) => [k, f(listener)])
                : [[key, listener]];
        })
        .map(([key, value]) => {
            if ("function" === typeof value) {
                const result = REGEXP.exec(key);
                const { obj, prop, temporality } = result.groups;
                return [obj, { [prop]: { [temporality]: value } }];
            }
            return [key, value];
        })
        .forEach(([obj, propTemporalityListener]) => {
            if (!listeners.has(obj)) {
                listeners.set(obj, new Map());
            }
            for (const [prop, temporalityListener] of Object.entries(
                propTemporalityListener,
            )) {
                if (!listeners.get(obj).has(prop)) {
                    listeners.get(obj).set(prop, { before: [], after: [] });
                }
                for (const [temporality, listener] of Object.entries(
                    temporalityListener,
                )) {
                    listeners.get(obj).get(prop)[temporality].push(listener);
                }
            }
        });
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
        const browser = new BrowserHooker(listeners);
        const browserContext = new BrowserContextHooker(listeners);
        const page = new PageHooker(listeners);
        const frame = new FrameHooker(listeners);
        const locator = new LocatorHooker(listeners);
        const frameLocator = new FrameLocatorHooker(listeners);
        const mouse = new MouseHooker(listeners);
        dispatch(
            [
                browser.first(),
                browserContext.first(),
                page.first(),
                frame.first(),
                locator.first(),
                frameLocator.first(),
                mouse.first(),
                ...(await flatAwait(options?.plugins ?? [])),
                mouse.last(),
                frameLocator.last(),
                locator.last(),
                frame.last(),
                page.last(),
                browserContext.last(),
                browser.last(),
            ],
            listeners,
        );

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
        const browser = new BrowserHooker(listeners);
        const browserContext = new BrowserContextHooker(listeners);
        const page = new PageHooker(listeners);
        const frame = new FrameHooker(listeners);
        const locator = new LocatorHooker(listeners);
        const frameLocator = new FrameLocatorHooker(listeners);
        const mouse = new MouseHooker(listeners);
        dispatch(
            [
                browser.first(),
                browserContext.first(),
                page.first(),
                frame.first(),
                locator.first(),
                frameLocator.first(),
                mouse.first(),
                ...(await flatAwait(options?.plugins ?? [])),
                mouse.last(),
                frameLocator.last(),
                locator.last(),
                frame.last(),
                page.last(),
                browserContext.last(),
                browser.last(),
            ],
            listeners,
        );

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
