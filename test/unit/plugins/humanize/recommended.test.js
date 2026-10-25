/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import humanizeRecommendedPlugins from "../../../../src/plugins/humanize/recommended.js";

describe("plugins/humanize/recommended.js", () => {
    describe("humanizeRecommendedPlugins()", () => {
        it("should support no options", () => {
            const recommended = humanizeRecommendedPlugins();

            assert.equal(recommended.length, 3);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty options", () => {
            const recommended = humanizeRecommendedPlugins({});

            assert.equal(recommended.length, 3);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = humanizeRecommendedPlugins({
                click: {},
                cursor: {},
                dialog: {},
            });

            assert.equal(recommended.length, 3);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support option", () => {
            const recommended = humanizeRecommendedPlugins({
                click: { delay: { min: 42, max: 42 } },
            });

            assert.equal(recommended.length, 3);

            const clickListener = recommended[0]["Locator.click:before"];
            const args = clickListener([]);
            assert.deepEqual(args, [{ delay: 42 }]);
        });

        it("should disable plugins", () => {
            const recommended = humanizeRecommendedPlugins({
                click: false,
                cursor: false,
                dialog: false,
            });

            assert.deepEqual(recommended, [{}, {}, {}]);
        });
    });
});
