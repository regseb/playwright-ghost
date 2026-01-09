/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import utilsDebugPlugin from "../../../../src/plugins/utils/debug.js";

const PageMock = class {
    /**
     * Liste des fonctions d'initialisation.
     *
     * @type {Function[]}
     */
    #initScrips = [];

    /**
     * Liste des écouteurs d'événements.
     *
     * @type {Map<string, Function>}
     */
    #listeners = new Map();

    /**
     * Simule l'ajout d'une fonction d'initialisation.
     *
     * @param {Function} fn La fonction d'initialisation.
     */
    addInitScript(fn) {
        this.#initScrips.push(fn);
    }

    /**
     * Simule l'enregistrement d'un écouteur d'événement.
     *
     * @param {string}   type     Le type de l'événement.
     * @param {Function} listener La fonction à appeler lorsque l'événement est
     *                            émis.
     */
    on(type, listener) {
        this.#listeners.set(type, listener);
    }

    /**
     * Renvoie un objet pour contrôler des valeurs et simuler des actions.
     *
     * @returns {Object<string, Function>} L'objet pour contrôler et simuler.
     */
    get mock() {
        return {
            initScripts: () => this.#initScrips,
            listeners: () => this.#listeners,

            /**
             * Émets un événement à la page.
             *
             * @param {string} type  Le type de l'événement.
             * @param {any}    event L'événement à émettre.
             */
            dispatch: (type, event) => {
                this.#listeners.get(type)(event);
            },
        };
    }
};

describe("plugins/utils/debug.js", () => {
    describe("utilsDebugPlugin()", () => {
        describe("Page:new", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should transfer 'console'", async () => {
                const log = mock.method(console, "log", () => undefined);
                const error = mock.method(console, "error", () => undefined);
                const page = new PageMock();

                const plugin = utilsDebugPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);
                page.mock.dispatch("console", "foo");

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);

                assert.equal(log.mock.callCount(), 1);
                assert.deepEqual(log.mock.calls[0].arguments, ["foo"]);
                assert.equal(error.mock.callCount(), 0);
            });

            it("should not transfer 'console'", async () => {
                const page = new PageMock();

                const plugin = utilsDebugPlugin({ console: false });
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);

                assert.equal(page.mock.listeners().get("console"), undefined);
                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
            });

            it("should transfer 'pageerror'", async () => {
                const log = mock.method(console, "log", () => undefined);
                const error = mock.method(console, "error", () => undefined);
                const page = new PageMock();

                const plugin = utilsDebugPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);
                page.mock.dispatch("pageerror", "foo");

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);

                assert.equal(log.mock.callCount(), 0);
                assert.equal(error.mock.callCount(), 1);
                assert.deepEqual(error.mock.calls[0].arguments, ["foo"]);
            });

            it("should not transfer 'pageerror'", async () => {
                const page = new PageMock();

                const plugin = utilsDebugPlugin({ pageerror: false });
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);

                assert.equal(page.mock.listeners().get("pageerror"), undefined);
                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
            });

            it("should add init script", async () => {
                const page = new PageMock();

                const plugin = utilsDebugPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);

                assert.equal(page.mock.initScripts().length, 1);
                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
            });

            it("should not add init script", async () => {
                const page = new PageMock();

                const plugin = utilsDebugPlugin({ cursor: false });
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);

                assert.equal(page.mock.initScripts().length, 0);
                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
            });
        });
    });
});
