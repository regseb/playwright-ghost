/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import dialogPlugin from "../../../../src/plugins/humanize/dialog.js";
import Random from "../../../../src/utils/random.js";

/**
 * Passe au prochain cycle de la boucle d'événements.
 *
 * @returns {Promise<void>} Une promesse résolue au prochain cycle.
 */
const nextEventLoopTick = () => {
    return new Promise((resolve) => {
        queueMicrotask(resolve);
    });
};

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

describe("plugins/humanize/dialog.js", function () {
    describe("dialogPlugin()", function () {
        describe("Page:new", function () {
            afterEach(function () {
                mock.reset();
            });

            it("should support no option", async function () {
                mock.timers.enable({ apis: ["setTimeout"] });
                const getInt = mock.method(Random, "getInt", () => 2000);
                const accept = mock.fn(() => Promise.resolve());
                const page = new PageMock();

                const plugin = dialogPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);
                page.mock.dispatch("dialog", { accept });
                mock.timers.tick(2000);
                // Passer au prochain cycle pour laisser la fonction, après le
                // wait de 2000 ms, s'exécuter.
                await nextEventLoopTick();

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);

                assert.equal(getInt.mock.callCount(), 1);
                assert.deepEqual(getInt.mock.calls[0].arguments, [1000, 5000]);
                assert.equal(accept.mock.callCount(), 1);
            });

            it("should support empty option", async function () {
                mock.timers.enable({ apis: ["setTimeout"] });
                const getInt = mock.method(Random, "getInt", () => 3000);
                const accept = mock.fn(() => Promise.resolve());
                const page = new PageMock();

                const plugin = dialogPlugin({});
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);
                page.mock.dispatch("dialog", { accept });
                mock.timers.tick(3000);
                // Passer au prochain cycle pour laisser la fonction, après le
                // wait de 3000 ms, s'exécuter.
                await nextEventLoopTick();

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);

                assert.equal(getInt.mock.callCount(), 1);
                assert.deepEqual(getInt.mock.calls[0].arguments, [1000, 5000]);
                assert.equal(accept.mock.callCount(), 1);
            });

            it("should support option", async function () {
                mock.timers.enable({ apis: ["setTimeout"] });
                const getInt = mock.method(Random, "getInt", () => 40);
                const accept = mock.fn(() => Promise.resolve());
                const page = new PageMock();

                const plugin = dialogPlugin({ timeout: { min: 10, max: 50 } });
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);
                page.mock.dispatch("dialog", { accept });
                mock.timers.tick(40);
                // Passer au prochain cycle pour laisser la fonction, après le
                // wait de 40 ms, s'exécuter.
                await nextEventLoopTick();

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);

                assert.equal(getInt.mock.callCount(), 1);
                assert.deepEqual(getInt.mock.calls[0].arguments, [10, 50]);
                assert.equal(accept.mock.callCount(), 1);
            });
        });
    });
});
