/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import polyfillPlugins from "../../../../src/plugins/polyfill/index.js";

describe("plugins/polyfill/index.js", () => {
    describe("polyfillPlugins", () => {
        it("should export polyfill plugins", () => {
            assert.equal(Object.keys(polyfillPlugins).length, 8);
            assert.equal(typeof polyfillPlugins.automation, "function");
            assert.equal(typeof polyfillPlugins.headless, "function");
            assert.equal(typeof polyfillPlugins.screen, "function");
            assert.equal(typeof polyfillPlugins.userAgent, "function");
            assert.equal(typeof polyfillPlugins.viewport, "function");
            assert.equal(typeof polyfillPlugins.webdriver, "function");
            assert.equal(typeof polyfillPlugins.webGL, "function");
            assert.equal(typeof polyfillPlugins.recommended, "function");
        });
    });
});
