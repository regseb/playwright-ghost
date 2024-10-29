/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import browserPlugin from "../../../../src/plugins/hook/browser.js";

describe("plugins/hook/browser.js", function () {
    describe("browserPlugin()", function () {
        describe("Browser:new", function () {
            // Ajouter des tests quand l'import de module pourra être mocké.
            // https://nodejs.org/api/test.html#mockmodulespecifier-options

            it("should do nothing when no listener", function () {
                const browser = {};
                const listeners = new Map([["BrowserType", "foo"]]);

                const plugin = browserPlugin();
                const listener = plugin["Browser:new"];
                const browserAltered = listener(browser, {
                    metadata: { listeners },
                });

                // Vérifier que le browser retourné est la même instance que
                // celui en paramètre.
                assert.equal(browserAltered, browser);
            });
        });
    });
});
