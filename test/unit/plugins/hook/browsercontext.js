/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import browserContextPlugin from "../../../../src/plugins/hook/browsercontext.js";

describe("plugins/hook/browsercontext.js", function () {
    describe("browserContextPlugin()", function () {
        describe("BrowserContext:new", function () {
            // Ajouter des tests quand l'import de module pourra être mocké.
            // https://nodejs.org/api/test.html#mockmodulespecifier-options

            it("should do nothing when no listener", function () {
                const context = {};
                const listeners = new Map([["Browser", "foo"]]);

                const plugin = browserContextPlugin();
                const listener = plugin["BrowserContext:new"];
                const contextAltered = listener(context, {
                    metadata: { listeners },
                });

                // Vérifier que le contexte retourné est la même instance que
                // celui en paramètre.
                assert.equal(contextAltered, context);
            });
        });
    });
});
