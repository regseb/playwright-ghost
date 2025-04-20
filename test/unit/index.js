/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Ghost from "../../src/ghost.js";
import playwright, {
    chromium,
    firefox,
    plugins,
    webkit,
} from "../../src/index.js";

describe("index.js", () => {
    describe("default", () => {
        it("should export all", () => {
            assert.ok(playwright.chromium instanceof Ghost);
            assert.ok(playwright.firefox instanceof Ghost);
            assert.ok(playwright.webkit instanceof Ghost);
            assert.equal(typeof playwright.plugins, "object");
        });

        it("should export chromium", () => {
            assert.ok(chromium instanceof Ghost);
        });

        it("should export firefox", () => {
            assert.ok(firefox instanceof Ghost);
        });

        it("should export webkit", () => {
            assert.ok(webkit instanceof Ghost);
        });

        it("should export plugins", () => {
            assert.equal(typeof plugins, "object");
        });
    });
});
