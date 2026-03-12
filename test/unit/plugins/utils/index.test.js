/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import utilsPlugins from "../../../../src/plugins/utils/index.js";

describe("plugins/utils/index.js", () => {
    describe("utilsPlugins", () => {
        it("should export utils plugins", () => {
            assert.equal(Object.keys(utilsPlugins).length, 1);
            assert.equal(typeof utilsPlugins.locale, "function");
        });
    });
});
