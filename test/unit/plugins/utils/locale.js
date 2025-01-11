/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import localePlugin from "../../../../src/plugins/utils/locale.js";

describe("plugins/utils/locale.js", function () {
    describe("localePlugin()", function () {
        describe("BrowserType.launch:before", function () {
            it("should throw error when not found", function () {
                const name = mock.fn(() => "iexplore");
                const browserType = { name };

                const plugin = localePlugin();
                const listener = plugin["BrowserType.launch:before"];

                assert.rejects(() => listener([], { obj: browserType }), {
                    name: "Error",
                    message: "iexplore not found locally",
                });

                assert.equal(name.mock.callCount(), 1);
            });
        });

        describe("BrowserType.launchPersistentContext:before", function () {
            it("should throw error when not found", function () {
                const name = mock.fn(() => "iexplore");
                const browserType = { name };

                const plugin = localePlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];

                assert.rejects(
                    () => listener(["./foo/"], { obj: browserType }),
                    {
                        name: "Error",
                        message: "iexplore not found locally",
                    },
                );

                assert.equal(name.mock.callCount(), 1);
            });
        });
    });
});
