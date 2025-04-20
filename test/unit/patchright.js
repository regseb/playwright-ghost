/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Ghost from "../../src/ghost.js";
import patchright, {
    chromium,
    firefox,
    plugins,
    webkit,
} from "../../src/patchright.js";

describe("patchright.js", () => {
    describe("default", () => {
        it("should export all", () => {
            assert.ok(patchright.chromium instanceof Ghost);
            assert.ok(patchright.firefox instanceof Ghost);
            assert.ok(patchright.webkit instanceof Ghost);
            assert.equal(typeof patchright.plugins, "object");
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
