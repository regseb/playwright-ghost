/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import plugins from "../../../src/plugins/index.js";

describe("plugins/index.js", () => {
    describe("plugins", () => {
        it("should export groups", () => {
            assert.equal(Object.keys(plugins).length, 5);
            assert.equal(typeof plugins.polyfill, "object");
            assert.equal(typeof plugins.humanize, "object");
            assert.equal(typeof plugins.utils, "object");
            assert.equal(typeof plugins.debug, "object");
            assert.equal(typeof plugins.recommended, "function");
        });
    });

    describe("plugins.polyfill", () => {
        it("should export polyfill plugins", () => {
            assert.equal(Object.keys(plugins.polyfill).length, 8);
            assert.equal(typeof plugins.polyfill.automation, "function");
            assert.equal(typeof plugins.polyfill.headless, "function");
            assert.equal(typeof plugins.polyfill.screen, "function");
            assert.equal(typeof plugins.polyfill.userAgent, "function");
            assert.equal(typeof plugins.polyfill.viewport, "function");
            assert.equal(typeof plugins.polyfill.webdriver, "function");
            assert.equal(typeof plugins.polyfill.webGL, "function");
            assert.equal(typeof plugins.polyfill.recommended, "function");
        });
    });

    describe("plugins.polyfill.recommended()", () => {
        it("should export recommended polyfill function", () => {
            const recommended = plugins.polyfill.recommended();

            assert.equal(recommended.length, 5);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });
    });

    describe("plugins.humanize", () => {
        it("should export humanize plugins", () => {
            assert.equal(Object.keys(plugins.humanize).length, 4);
            assert.equal(typeof plugins.humanize.click, "function");
            assert.equal(typeof plugins.humanize.cursor, "function");
            assert.equal(typeof plugins.humanize.dialog, "function");
            assert.equal(typeof plugins.humanize.recommended, "function");
        });
    });

    describe("plugins.humanize.recommended()", () => {
        it("should export recommended humanize function", () => {
            const recommended = plugins.humanize.recommended();

            assert.equal(recommended.length, 3);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });
    });

    describe("plugins.utils", () => {
        it("should export utils plugins", () => {
            assert.equal(Object.keys(plugins.utils).length, 1);
            assert.equal(typeof plugins.utils.locale, "function");
        });
    });

    describe("plugins.debug", () => {
        it("should export debug plugins", () => {
            assert.equal(Object.keys(plugins.debug).length, 3);
            assert.equal(typeof plugins.debug.console, "function");
            assert.equal(typeof plugins.debug.cursor, "function");
            assert.equal(typeof plugins.debug.sniffer, "function");
        });
    });

    describe("plugins.recommended()", () => {
        it("should export recommended function", () => {
            const recommended = plugins.recommended();

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
