/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { WebSocketServer } from "ws";
import "../../polyfills/map.js";

/**
 * @import { Buffer } from "node:buffer"
 * @import { Page } from "playwright"
 */

/**
 * Contourne la
 * [Content Security Policy (CSP)](https://developer.mozilla.org/Web/HTTP/Guides/CSP).
 *
 * @param {Record<string, any>|undefined} options Les options de création
 *                                                d'un contexte.
 * @returns {Record<string, any>} Les nouvelles options.
 */
const setBypassCSP = (options) => {
    return {
        bypassCSP: true,
        ...options,
    };
};

/**
 * Crée un script pour surveiller l'utilisation des propriétés de la page. Cette
 * fonction est exécutée dans le navigateur. Elle communique, avec le programme
 * Node.js, en passant par une WebSocket.
 *
 * @param {number} port Le port de la WebSocket.
 */
const initScript = async (port) => {
    const ws = await new Promise((resolve, reject) => {
        const socket = new WebSocket(`ws://localhost:${port}/`);
        socket.addEventListener("open", () => resolve(socket));
        socket.addEventListener("error", (err) => reject(err));
    });

    // eslint-disable-next-line no-undef
    const url = location.href;
    const wsSend = ws.send.bind(ws);
    const objectEntries = Object.entries;
    const objectGetOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
    const objectDefineProperty = Object.defineProperty;

    const handled = new WeakSet();
    const handledHas = WeakSet.prototype.has.bind(handled);
    const handledAdd = WeakSet.prototype.add.bind(handled);

    const Disabled = class {
        #disabled = 0;

        runInDisabled(fn) {
            ++this.#disabled;
            try {
                return fn();
            } finally {
                --this.#disabled;
            }
        }

        runIfEnabled(fn, fallback = undefined) {
            return 0 < this.#disabled ? fallback : fn();
        }
    };

    const disabled = new Disabled();

    const send = (path) => wsSend(`{ "url": "${url}", "key": "${path}" }`);

    const observe = (obj, prop, descriptor, path) => {
        if (descriptor?.configurable) {
            if (descriptor?.value) {
                objectDefineProperty(obj, prop, {
                    get() {
                        disabled.runIfEnabled(() => {
                            objectDefineProperty(obj, prop, descriptor);
                            send(path);
                        });
                        return descriptor.value;
                    },
                    ...(descriptor.writable
                        ? {
                              set(value) {
                                  disabled.runIfEnabled(() => {
                                      objectDefineProperty(
                                          obj,
                                          prop,
                                          descriptor,
                                      );
                                      send(path);
                                  });
                                  // eslint-disable-next-line no-param-reassign
                                  descriptor.value = value;
                              },
                          }
                        : {}),
                    enumerable: descriptor.enumerable,
                    configurable: descriptor.configurable,
                });
            } else if (descriptor?.get) {
                objectDefineProperty(obj, prop, {
                    ...(descriptor.get
                        ? {
                              get() {
                                  disabled.runIfEnabled(() => {
                                      objectDefineProperty(
                                          obj,
                                          prop,
                                          descriptor,
                                      );
                                      send(path);
                                  });
                                  return disabled.runInDisabled(() =>
                                      descriptor.get.call(this),
                                  );
                              },
                          }
                        : {}),
                    ...(descriptor.set
                        ? {
                              set(value) {
                                  disabled.runIfEnabled(() => {
                                      objectDefineProperty(
                                          obj,
                                          prop,
                                          descriptor,
                                      );
                                      send(path);
                                  });
                                  disabled.runInDisabled(() =>
                                      descriptor.set.call(this, value),
                                  );
                              },
                          }
                        : {}),
                    enumerable: descriptor.enumerable,
                    configurable: descriptor.configurable,
                });
            }
        }
        // eslint-disable-next-line no-use-before-define
        walk(descriptor.value, `${path}.`);
    };

    const walk = (obj, pathParent = "") => {
        if (
            null === obj ||
            ("object" !== typeof obj && "function" !== typeof obj) ||
            handledHas(obj)
        ) {
            return;
        }
        handledAdd(obj);

        for (const [prop, descriptor] of objectEntries(
            objectGetOwnPropertyDescriptors(obj),
        )) {
            observe(obj, prop, descriptor, `${pathParent}${prop}`);
        }
    };

    walk(globalThis);
};

/**
 * Crée un plugin pour surveiller toutes les propriétés utilisées dans une page.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 */
export default function debugSnifferPlugin() {
    return {
        /**
         * Modifie les options de lancement d'un contexte (et du navigateur).
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (args) => {
            return [args[0], setBypassCSP(args[1])];
        },

        /**
         * Modifie les options de création d'un contexte.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newContext:before": (args) => {
            return [setBypassCSP(args[0])];
        },

        /**
         * Modifie les options de création d'un contexte d'une page.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newPage:before": (args) => {
            return [setBypassCSP(args[0])];
        },

        /**
         * Ajoute un script qui surveiller l'utilisation des propriétés de la
         * page.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Promise<Page>} Une promesse contenant la page avec le
         *                          script.
         */
        "Page:new": async (page) => {
            const map = new Map();

            const wss = new WebSocketServer({ port: 0 });
            wss.on("connection", (/** @type {WebSocket} */ ws) => {
                ws.on("message", (/** @type {Buffer} */ data) => {
                    const entry = JSON.parse(data.toString());
                    const frame = map.getOrInsertComputed(
                        entry.url,
                        () => new Set(),
                    );
                    frame.add(entry.key);
                });
            });

            // Ajouter le init script dans la page et non dans le contexte, car
            // il est possible de créer une page "sans" contexte (cf.
            // Browser.newPage()).
            await page.addInitScript(initScript, wss.address().port);

            // eslint-disable-next-line no-param-reassign
            page.sniffer = {
                /**
                 * Récupère les propriétés utilisées pour chaque frame de la
                 * page.
                 *
                 * @returns {Record<string, string[]>} Les propriétés utilisées
                 *                                     pour chaque frame.
                 */
                get: () => {
                    return Object.fromEntries(
                        Array.from(map.entries(), ([key, value]) => [
                            key,
                            Array.from(value).toSorted((a, b) =>
                                a.toLowerCase().localeCompare(b.toLowerCase()),
                            ),
                        ]),
                    );
                },

                reset: () => map.clear(),
            };

            // Arrêter le serveur à la fermeture de la page.
            page.on("close", () => {
                wss.close();
            });

            return page;
        },
    };
}
