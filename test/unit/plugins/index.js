/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import plugins from "../../../src/plugins/index.js";

describe("plugins/index.js", function () {
    describe("plugins.recommended()", function () {
        it("should support no option", function () {
            const recommended = plugins.recommended();

            assert.equal(recommended.length, 7);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", function () {
            const recommended = plugins.recommended({});

            assert.equal(recommended.length, 7);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });
    });
});
