/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import debugCursorPlugin from "../../../../src/plugins/debug/cursor.js";

describe("plugins/debug/cursor.js", () => {
    describe("debugCursorPlugin()", () => {
        describe("Page:new", () => {
            it("should add init script", async () => {
                const addInitScript = mock.fn(() => Promise.resolve());
                const page = { addInitScript };

                const plugin = debugCursorPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);

                assert.equal(addInitScript.mock.callCount(), 1);
                assert.equal(
                    typeof addInitScript.mock.calls[0].arguments[0],
                    "function",
                );
                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
            });
        });
    });
});
