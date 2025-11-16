/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import utilsAdblockerPlugin from "../../../../src/plugins/utils/adblocker.js";

describe("plugins/utils/adblocker.js", () => {
    describe("utilsAdblockerPlugin()", () => {
        describe("Page:new", () => {
            // Ajouter des tests quand l'import de module pourra être mocké.
            // https://nodejs.org/api/test.html#mockmodulespecifier-options

            it("should reject invalide mode", async () => {
                await assert.rejects(
                    // @ts-expect-error -- Le mode n'existe pas volontairement.
                    () =>
                        utilsAdblockerPlugin({ mode: "fromNonexistentMethod" }),
                    {
                        name: "TypeError",
                        message: "invalid mode",
                    },
                );
            });
        });
    });
});
