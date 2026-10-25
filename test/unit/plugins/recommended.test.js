/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import recommendedPlugins from "../../../src/plugins/recommended.js";

describe("plugins/recommended.js", () => {
    describe("recommendedPlugins()", () => {
        it("should support no options", () => {
            const recommended = recommendedPlugins();

            assert.equal(recommended.length, 8);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty options", () => {
            const recommended = recommendedPlugins({});

            assert.equal(recommended.length, 8);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = recommendedPlugins({
                polyfill: {},
                humanize: {},
            });

            assert.equal(recommended.length, 8);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should disable plugins", () => {
            const recommended = recommendedPlugins({
                polyfill: false,
                humanize: false,
            });

            assert.deepEqual(recommended, []);
        });
    });
});
