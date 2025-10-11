/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { WebSocketServer } from "ws";

/**
 * @import { Page } from "playwright"
 */

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

    const send = (path, value) =>
        disabled.runIfEnabled(() =>
            wsSend(`{ "key": "${path}", "value": "${value}" }`),
        );

    const observe = (obj, pathParent = "") => {
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
            const path = `${pathParent}${prop}`;
            if (descriptor?.configurable) {
                if (descriptor?.value) {
                    objectDefineProperty(obj, prop, {
                        get() {
                            send(path, "get");
                            return descriptor.value;
                        },
                        ...(descriptor.writable
                            ? {
                                  set(value) {
                                      send(path, "set");
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
                                      send(path, "get");
                                      return disabled.runInDisabled(() =>
                                          descriptor.get.call(this),
                                      );
                                  },
                              }
                            : {}),
                        ...(descriptor.set
                            ? {
                                  set(value) {
                                      send(path, "set");
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
            observe(descriptor.value, `${path}.`);
        }
    };

    observe(globalThis);
};

/**
 * Crée un plugin pour surveiller toutes les propriétés utilisées dans une page.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 */
export default function debugSnifferPlugin() {
    return {
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
                ws.on("message", (data) => {
                    const entry = JSON.parse(data.toString());
                    if (map.has(entry.key)) {
                        map.get(entry.key).add(entry.value);
                    } else {
                        map.set(entry.key, new Set([entry.value]));
                    }
                });
            });

            // Ajouter le init script dans la page et non dans le contexte, car
            // il est possible de créer une page "sans" contexte (cf.
            // Browser.newPage()).
            await page.addInitScript(initScript, wss.address().port);

            // eslint-disable-next-line no-param-reassign
            page.sniffer = {
                /**
                 * Récupère les propriétés utilisées dans la page.
                 *
                 * @returns {Record<string, string[]>} Les propriétés utilisées.
                 */
                get: () => {
                    return Object.fromEntries(
                        Array.from(map.entries())
                            .toSorted(([a], [b]) =>
                                a.toLowerCase().localeCompare(b.toLowerCase()),
                            )
                            .map(([key, value]) => [
                                key,
                                Array.from(value).toSorted(),
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
