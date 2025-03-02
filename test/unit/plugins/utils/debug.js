/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import debugPlugin from "../../../../src/plugins/utils/debug.js";

const PageMock = class {
    #listeners = new Map();

    on(type, listener) {
        this.#listeners.set(type, listener);
    }

    get mock() {
        return {
            dispatch: (type, event) => {
                this.#listeners.get(type)(event);
            },
        };
    }
};

describe("plugins/utils/debug.js", function () {
    describe("debugPlugin()", function () {
        describe("Page:new", function () {
            afterEach(function () {
                mock.reset();
            });

            it("should transfer 'console'", function () {
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

            it("should transfer 'pageerror'", function () {
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
