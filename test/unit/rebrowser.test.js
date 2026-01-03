/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Ghost from "../../src/ghost.js";
import rebrowser, { chromium, firefox, webkit } from "../../src/rebrowser.js";

describe("rebrowser.js", () => {
    describe("default", () => {
        it("should export all", () => {
            assert.ok(rebrowser.chromium instanceof Ghost);
            assert.ok(rebrowser.firefox instanceof Ghost);
            assert.ok(rebrowser.webkit instanceof Ghost);
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
    });
});
