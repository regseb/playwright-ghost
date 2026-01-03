/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import plugins from "../../../src/plugins/index.js";

describe("plugins/index.js", () => {
    describe("plugins.polyfill", () => {
        it("should export polyfill plugins", () => {
            assert.equal(Object.keys(plugins.polyfill).length, 8);
            assert.equal(typeof plugins.polyfill.recommended, "function");
            assert.equal(typeof plugins.polyfill.automation, "function");
            assert.equal(typeof plugins.polyfill.headless, "function");
            assert.equal(typeof plugins.polyfill.screen, "function");
            assert.equal(typeof plugins.polyfill.userAgent, "function");
            assert.equal(typeof plugins.polyfill.viewport, "function");
            assert.equal(typeof plugins.polyfill.webdriver, "function");
            assert.equal(typeof plugins.polyfill.webGL, "function");
        });
    });

    describe("plugins.polyfill.recommended()", () => {
        it("should support no options", () => {
            const recommended = plugins.polyfill.recommended();

            assert.equal(recommended.length, 5);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty options", () => {
            const recommended = plugins.polyfill.recommended({});

            assert.equal(recommended.length, 5);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = plugins.polyfill.recommended({
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

        it("should disable plugins", () => {
            const recommended = plugins.polyfill.recommended({
                automation: false,
                headless: false,
                screen: false,
                viewport: false,
                webdriver: false,
            });

            assert.deepEqual(recommended, [{}, {}, {}, {}, {}]);
        });
    });

    describe("plugins.humanize", () => {
        it("should export humanize plugins", () => {
            assert.equal(Object.keys(plugins.humanize).length, 4);
            assert.equal(typeof plugins.humanize.recommended, "function");
            assert.equal(typeof plugins.humanize.click, "function");
            assert.equal(typeof plugins.humanize.cursor, "function");
            assert.equal(typeof plugins.humanize.dialog, "function");
        });
    });

    describe("plugins.humanize.recommended()", () => {
        it("should support no options", () => {
            const recommended = plugins.humanize.recommended();

            assert.equal(recommended.length, 3);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty options", () => {
            const recommended = plugins.humanize.recommended({});

            assert.equal(recommended.length, 3);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = plugins.humanize.recommended({
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

        it("should disable plugins", () => {
            const recommended = plugins.humanize.recommended({
                click: false,
                cursor: false,
                dialog: false,
            });

            assert.deepEqual(recommended, [{}, {}, {}]);
        });
    });

    describe("plugins.utils", () => {
        it("should export utils plugins", () => {
            assert.equal(Object.keys(plugins.utils).length, 7);
            assert.equal(typeof plugins.utils.adblocker, "function");
            assert.equal(typeof plugins.utils.camoufox, "function");
            assert.equal(typeof plugins.utils.debug, "function");
            assert.equal(typeof plugins.utils.fingerprint, "function");
            assert.equal(typeof plugins.utils.locale, "function");
            assert.equal(typeof plugins.utils.weston, "function");
            assert.equal(typeof plugins.utils.xvfb, "function");
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
        it("should support no options", () => {
            const recommended = plugins.recommended();

            assert.equal(recommended.length, 8);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty options", () => {
            const recommended = plugins.recommended({});

            assert.equal(recommended.length, 8);
            for (const plugin of recommended) {
                assert.equal(typeof plugin, "object");
                for (const listener of Object.values(plugin)) {
                    assert.equal(typeof listener, "function");
                }
            }
        });

        it("should support empty option", () => {
            const recommended = plugins.recommended({
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
            const recommended = plugins.recommended({
                polyfill: false,
                humanize: false,
            });

            assert.deepEqual(recommended, []);
        });
    });
});
