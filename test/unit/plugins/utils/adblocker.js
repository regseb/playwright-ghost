/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import adblockerPlugin from "../../../../src/plugins/utils/adblocker.js";

describe("plugins/utils/adblocker.js", function () {
    describe("adblockerPlugin()", function () {
        describe("Page:new", function () {
            // Ajouter des tests quand l'import de module pourra être mocké.
            // https://nodejs.org/api/test.html#mockmodulespecifier-options

            it("should reject invalide mode", async function () {
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
