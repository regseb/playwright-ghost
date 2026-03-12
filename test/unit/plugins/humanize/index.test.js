/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import humanizePlugins from "../../../../src/plugins/humanize/index.js";

describe("plugins/humanize/index.js", () => {
    describe("humanizePlugins", () => {
        it("should export humanize plugins", () => {
            assert.equal(Object.keys(humanizePlugins).length, 4);
            assert.equal(typeof humanizePlugins.click, "function");
            assert.equal(typeof humanizePlugins.cursor, "function");
            assert.equal(typeof humanizePlugins.dialog, "function");
            assert.equal(typeof humanizePlugins.recommended, "function");
        });
    });
});
