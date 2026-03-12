/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import debugPlugins from "../../../../src/plugins/debug/index.js";

describe("plugins/debug/index.js", () => {
    describe("debugPlugins", () => {
        it("should export debug plugins", () => {
            assert.equal(Object.keys(debugPlugins).length, 3);
            assert.equal(typeof debugPlugins.console, "function");
            assert.equal(typeof debugPlugins.cursor, "function");
            assert.equal(typeof debugPlugins.sniffer, "function");
        });
    });
});
