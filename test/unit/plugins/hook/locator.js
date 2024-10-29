/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import locatorPlugin from "../../../../src/plugins/hook/locator.js";

describe("plugins/hook/locator.js", function () {
    describe("locatorPlugin()", function () {
        describe("Locator:new", function () {
            // Ajouter des tests quand l'import de module pourra être mocké.
            // https://nodejs.org/api/test.html#mockmodulespecifier-options

            it("should do nothing when no listener", function () {
                const locator = {};
                const listeners = new Map([["Page", "foo"]]);

                const plugin = locatorPlugin();
                const listener = plugin["Locator:new"];
                const locatorAltered = listener(locator, {
                    metadata: { listeners },
                });

                // Vérifier que le locator retourné est la même instance que
                // celui en paramètre.
                assert.equal(locatorAltered, locator);
            });
        });
    });
});
