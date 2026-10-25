/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import polyfillRecommendedPlugins from "../../../../src/plugins/polyfill/recommended.js";

describe("plugins/polyfill/recommended.js", () => {
    describe("polyfillRecommendedPlugins()", () => {
        it("should support no options", () => {
            const recommended = polyfillRecommendedPlugins();

            assert.equal(recommended.length, 5);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty options", () => {
            const recommended = polyfillRecommendedPlugins({});

            assert.equal(recommended.length, 5);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = polyfillRecommendedPlugins({
                screen: {},
                viewport: {},
            });

            assert.equal(recommended.length, 5);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support option", () => {
            const recommended = polyfillRecommendedPlugins({
                screen: { width: 2560, height: 1440 },
            });

            assert.equal(recommended.length, 5);

            const screenListener = recommended[2]["Browser.newContext:before"];
            const args = screenListener([]);
            assert.deepEqual(args, [{ screen: { width: 2560, height: 1440 } }]);
        });

        it("should disable plugins", () => {
            const recommended = polyfillRecommendedPlugins({
                automation: false,
                headless: false,
                screen: false,
                viewport: false,
                webdriver: false,
            });

            assert.deepEqual(recommended, [{}, {}, {}, {}, {}]);
        });
    });
});
