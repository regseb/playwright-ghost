/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import plugins from "../../../src/plugins/index.js";

describe("plugins/index.js", () => {
    describe("plugins.polyfill.recommended()", () => {
        it("should support no option", () => {
            const recommended = plugins.polyfill.recommended();

            assert.equal(recommended.length, 5);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = plugins.polyfill.recommended({});

            assert.equal(recommended.length, 5);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });
    });

    describe("plugins.humanize.recommended()", () => {
        it("should support no option", () => {
            const recommended = plugins.humanize.recommended();

            assert.equal(recommended.length, 3);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = plugins.humanize.recommended({});

            assert.equal(recommended.length, 3);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });
    });

    describe("plugins.recommended()", () => {
        it("should support no option", () => {
            const recommended = plugins.recommended();

            assert.equal(recommended.length, 8);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = plugins.recommended({});

            assert.equal(recommended.length, 8);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });
    });
});
