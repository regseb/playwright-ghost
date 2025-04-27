/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import debugPlugin from "../../../../src/plugins/utils/debug.js";

const PageMock = class {
    #listeners = new Map();

    /**
     * Enregistre un écouteur d'événement.
     *
     * @param {string}   type     Le type de l'événement.
     * @param {Function} listener La fonction à appeler lorsque l'événement est émis.
     */
    on(type, listener) {
        this.#listeners.set(type, listener);
    }

    get mock() {
        return {
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
    describe("debugPlugin()", () => {
        describe("Page:new", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should transfer 'console'", () => {
                const log = mock.method(console, "log", () => {});
                const error = mock.method(console, "error", () => {});
                const page = new PageMock();

                const plugin = debugPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);
                page.mock.dispatch("console", "foo");

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);

                assert.equal(log.mock.callCount(), 1);
                assert.deepEqual(log.mock.calls[0].arguments, ["foo"]);
                assert.equal(error.mock.callCount(), 0);
            });

            it("should transfer 'pageerror'", () => {
                const log = mock.method(console, "log", () => {});
                const error = mock.method(console, "error", () => {});
                const page = new PageMock();

                const plugin = debugPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);
                page.mock.dispatch("pageerror", "foo");

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);

                assert.equal(log.mock.callCount(), 0);
                assert.equal(error.mock.callCount(), 1);
                assert.deepEqual(error.mock.calls[0].arguments, ["foo"]);
            });
        });
    });
});
