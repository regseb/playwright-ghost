/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import utilsLocalePlugin from "../../../../src/plugins/utils/locale.js";

describe("plugins/utils/locale.js", () => {
    describe("utilsLocalePlugin()", () => {
        describe("BrowserType.launch:before", () => {
            it("should throw error when not found", async () => {
                const name = mock.fn(() => "iexplore");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener = plugin["BrowserType.launch:before"];

                await assert.rejects(() => listener([], { obj: browserType }), {
                    name: "Error",
                    message: "iexplore not found",
                });

                assert.equal(name.mock.callCount(), 1);
            });
        });

        describe("BrowserType.launchPersistentContext:before", () => {
            it("should throw error when not found", async () => {
                const name = mock.fn(() => "iexplore");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];

                await assert.rejects(
                    () => listener(["./foo/"], { obj: browserType }),
                    {
                        name: "Error",
                        message: "iexplore not found",
                    },
                );

                assert.equal(name.mock.callCount(), 1);
            });
        });
    });
});
