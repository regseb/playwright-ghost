/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import Ghost from "../../src/ghost.js";
import playwright, {
    chromium,
    firefox,
    plugins,
    webkit,
} from "../../src/index.js";

describe("index.js", function () {
    describe("default", function () {
        it("should export all", function () {
            assert.ok(playwright.chromium instanceof Ghost);
            assert.ok(playwright.firefox instanceof Ghost);
            assert.ok(playwright.webkit instanceof Ghost);
            assert.equal(typeof playwright.plugins, "object");
        });

        it("should export chromium", function () {
            assert.ok(chromium instanceof Ghost);
        });

        it("should export firefox", function () {
            assert.ok(firefox instanceof Ghost);
        });

        it("should export webkit", function () {
            assert.ok(webkit instanceof Ghost);
        });

        it("should export plugins", function () {
            assert.equal(typeof plugins, "object");
        });
    });
});
