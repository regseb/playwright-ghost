/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import Ghost from "../../src/ghost.js";
import patchright, {
    chromium,
    firefox,
    plugins,
    webkit,
} from "../../src/patchright.js";

describe("patchright.js", function () {
    describe("default", function () {
        it("should export all", function () {
            assert.ok(patchright.chromium instanceof Ghost);
            assert.ok(patchright.firefox instanceof Ghost);
            assert.ok(patchright.webkit instanceof Ghost);
            assert.equal(typeof patchright.plugins, "object");
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
