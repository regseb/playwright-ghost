/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "./hook.js";
import BrowserHooker from "./hookers/browser.js";
import BrowserContextHooker from "./hookers/browsercontext.js";
import BrowserServerHooker from "./hookers/browserserver.js";
import FrameHooker from "./hookers/frame.js";
import FrameLocatorHooker from "./hookers/framelocator.js";
import LocatorHooker from "./hookers/locator.js";
import MouseHooker from "./hookers/mouse.js";
import PageHooker from "./hookers/page.js";
import "./polyfills/map.js";
import flatAwait from "./utils/flatawait.js";

/**
 * @import {
 *     Browser,
 *     BrowserContext,
 *     BrowserServer,
 *     BrowserType,
 *     ConnectOptions,
 *     ConnectOverCDPOptions,
 *     LaunchOptions,
 * } from "playwright"
 * @import { Listener } from "./hook.js"
 */

/**
 * Créer un type pour les options de la méthode
 * `BrowserType.launchPersistentContext()`, car ce paramètre n'a pas de type.
 * Surement parce que c'est la fusion des options de création d'un `Browser` et
 * d'un `BrowserContext`.
 *
 * @typedef {Parameters<BrowserType["launchPersistentContext"]>[1]} LaunchPersistentContextOptions
 */

/**
 * Créer un type pour les options de la méthode `BrowserType.launchServer()`,
 * car ce paramètre n'a pas de type.
 *
 * @typedef {Parameters<BrowserType["launchServer"]>[0]} LaunchServerOptions
 */

/**
 * @typedef {Object} OptionPlugins Option pour les plugins qui sera ajouté aux
 *                                 options des méthodes.
 * @prop {(Object|Promise<Object>)[]} [plugins] Liste des plugins.
 */

const REGEXP = /^(?<obj>\w+)\.(?<prop>\w+):(?<temporality>after|before)$/v;

const PRESETS = {
    "Browser:new": Object.entries(BrowserHooker.PRESETS),
    "BrowserContext:new": Object.entries(BrowserContextHooker.PRESETS),
    "BrowserServer:new": Object.entries(BrowserServerHooker.PRESETS),
    "Page:new": Object.entries(PageHooker.PRESETS),
    "Frame:new": Object.entries(FrameHooker.PRESETS),
    "Locator:new": Object.entries(LocatorHooker.PRESETS),
    "FrameLocator:new": Object.entries(FrameLocatorHooker.PRESETS),
    "Mouse:new": Object.entries(MouseHooker.PRESETS),
};

/**
 * Répartit les crochets pour les regrouper par objet, propriété et temporalité.
 *
 * @param {Record<string, Function>[]}         hooks     Liste des crochets.
 * @param {Map<string, Map<string, Listener>>} listeners Écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 */
const dispatch = (hooks, listeners) => {
    hooks
        .flatMap((h) => Object.entries(h))
        .flatMap(
            ([key, listener]) =>
                PRESETS[key]?.map(([k, f]) => [k, f(listener)]) ?? [
                    [key, listener],
                ],
        )
        .map(([key, value]) => {
            if ("function" === typeof value) {
                const result = REGEXP.exec(key);
                const { obj, prop, temporality } = result.groups;
                return [obj, { [prop]: { [temporality]: value } }];
            }
            return [key, value];
        })
        .forEach(([obj, propTemporalityListener]) => {
            // @ts-expect-error
            const listenersByObj = listeners.getOrInsertComputed(
                obj,
                () => new Map(),
            );
            for (const [prop, temporalityListener] of Object.entries(
                propTemporalityListener,
            )) {
                const listenersByProp = listenersByObj.getOrInsert(prop, {
                    before: [],
                    after: [],
                });
                for (const [temporality, listener] of Object.entries(
                    temporalityListener,
                )) {
                    listenersByProp[temporality].push(listener);
                }
            }
        });
};

export default class Ghost {
    /**
     * `BrowserType` vanille de Playwright.
     *
     * @type {BrowserType}
     */
    #browserType;

    /**
     * Crée une version fantôme d'un `BrowserType` de Playwright
     *
     * @param {BrowserType} browserType `BrowserType` vanille de Playwright.
     */
    constructor(browserType) {
        this.#browserType = browserType;
    }

    /**
     * Fusionne les plugins avec les crocheteurs et les intègre au
     * `BrowserType`.
     *
     * @param {(Object|Promise<Object>)[]} [plugins] Liste des plugins.
     * @returns {Promise<BrowserType>} `BrowserType` avec les plugins et
     *                                 crocheteurs.
     */
    async #hookize(plugins = []) {
        const listeners = new Map();
        const browser = new BrowserHooker(listeners);
        const browserContext = new BrowserContextHooker(listeners);
        const browserServer = new BrowserServerHooker(listeners);
        const page = new PageHooker(listeners);
        const frame = new FrameHooker(listeners);
        const locator = new LocatorHooker(listeners);
        const frameLocator = new FrameLocatorHooker(listeners);
        const mouse = new MouseHooker(listeners);
        dispatch(
            [
                browser.first(),
                browserContext.first(),
                browserServer.first(),
                page.first(),
                frame.first(),
                locator.first(),
                frameLocator.first(),
                mouse.first(),
                ...(await flatAwait(plugins)),
                mouse.last(),
                frameLocator.last(),
                locator.last(),
                frame.last(),
                page.last(),
                browserServer.last(),
                browserContext.last(),
                browser.last(),
            ],
            listeners,
        );
        return hook(this.#browserType, listeners.get("BrowserType"));
    }

    /**
     * Associe un `Browser` fantôme à une instance de navigateur créée via
     * `BrowserType.launchServer()`.
     *
     * @param {string}                       wsEndpoint Point de terminaison
     *                                                  WebSocket de l'instance
     *                                                  du navigateur.
     * @param {ConnectOptions&OptionPlugins} [options]  Options de connection.
     * @returns {Promise<Browser>} Promesse contenant la version fantôme du
     *                             `Browser`.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-connect
     */
    async connect(wsEndpoint, options) {
        const hooked = await this.#hookize(options?.plugins);
        return await hooked.connect(wsEndpoint, options);
    }

    /**
     * Associe un `Browser` fantôme à une instance de navigateur en utilisant
     * le _Chrome DevTools Protocol_ (_CDP_).
     *
     * @param {string}                              wsEndpoint Point de
     *                                                         terminaison CDP
     *                                                         WebSocket ou URL
     *                                                         HTTP de
     *                                                         l'instance du
     *                                                         navigateur.
     * @param {ConnectOverCDPOptions&OptionPlugins} [options]  Options de
     *                                                         connection.
     * @returns {Promise<Browser>} Promesse contenant la version fantôme du
     *                             `Browser`.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp
     */
    async connectOverCDP(wsEndpoint, options) {
        const hooked = await this.#hookize(options?.plugins);
        return await hooked.connectOverCDP(wsEndpoint, options);
    }

    /**
     * Récupère le chemin de l'exécutable du navigateur.
     *
     * @returns {string} Chemin de l'exécutable.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-executable-path
     */
    executablePath() {
        return this.#browserType.executablePath();
    }

    /**
     * Lance une version fantôme d'un `Browser` de Playwright.
     *
     * @param {LaunchOptions&OptionPlugins} [options] Options de création d'un
     *                                                `Browser`.
     * @returns {Promise<Browser>} Promesse contenant la version fantôme du
     *                             `Browser`.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-launch
     */
    async launch(options) {
        const hooked = await this.#hookize(options?.plugins);
        return await hooked.launch(options);
    }

    /**
     * Lance une version fantôme d'un `BrowserContext` de Playwright.
     *
     * @param {string}                                       userDataDir Chemin
     *                                                                   vers le
     *                                                                   répertoire
     *                                                                   des
     *                                                                   données
     *                                                                   de
     *                                                                   session.
     * @param {LaunchPersistentContextOptions&OptionPlugins} [options]   Options
     *                                                                   de
     *                                                                   création
     *                                                                   d'un
     *                                                                   `Browser`
     *                                                                   et de
     *                                                                   son
     *                                                                   `BrowserContext`.
     * @returns {Promise<BrowserContext>} Promesse contenant la version fantôme
     *                                    du `BrowserContext`.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context
     */
    async launchPersistentContext(userDataDir, options) {
        const hooked = await this.#hookize(options?.plugins);
        return await hooked.launchPersistentContext(userDataDir, options);
    }

    /**
     * Lance un serveur fantôme de Playwright.
     *
     * @param {LaunchServerOptions&OptionPlugins} [options] Options de création
     *                                                      d'un
     *                                                      `BrowserServer`.
     * @returns {Promise<BrowserServer>} Promesse contenant la version fantôme
     *                                   du `BrowserServer`.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-launch-server
     */
    async launchServer(options) {
        const hooked = await this.#hookize(options?.plugins);
        return await hooked.launchServer(options);
    }

    /**
     * Retourne le nom du type de navigateur. Par exemple : `chromium`, `webkit`
     * ou `firefox`.
     *
     * @returns {string} Nom du type de navigateur.
     * @see https://playwright.dev/docs/api/class-browsertype#browser-type-name
     */
    name() {
        return this.#browserType.name();
    }
}
