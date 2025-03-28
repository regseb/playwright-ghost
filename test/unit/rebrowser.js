/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import Ghost from "../../src/ghost.js";
import rebrowser, {
    chromium,
    firefox,
    plugins,
    webkit,
} from "../../src/rebrowser.js";

describe("rebrowser.js", function () {
    describe("default", function () {
        it("should export all", function () {
            assert.ok(rebrowser.chromium instanceof Ghost);
            assert.ok(rebrowser.firefox instanceof Ghost);
            assert.ok(rebrowser.webkit instanceof Ghost);
            assert.equal(typeof rebrowser.plugins, "object");
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
