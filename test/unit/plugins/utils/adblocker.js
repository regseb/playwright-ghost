/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import adblockerPlugin from "../../../../src/plugins/utils/adblocker.js";

describe("plugins/utils/adblocker.js", () => {
    describe("adblockerPlugin()", () => {
        describe("Page:new", () => {
            // Ajouter des tests quand l'import de module pourra être mocké.
            // https://nodejs.org/api/test.html#mockmodulespecifier-options

            it("should reject invalide mode", async () => {
                await assert.rejects(
                    () => adblockerPlugin({ mode: "fromNonexistentMethod" }),
                    {
                        name: "TypeError",
                        message: "invalid mode",
                    },
                );
            });
        });
    });
});
