/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../src/index.js";

/**
 * @import { BrowserServer } from "playwright-core";
 */

describe("Hooker: browserServer", () => {
    it("should add plugin in BrowserServer", async () => {
        const browserServer = await vanilla.chromium.launchServer({
            plugins: [
                {
                    "BrowserServer:new": (
                        /** @type {BrowserServer} */ vanillaBrowserServer,
                    ) => {
                        // eslint-disable-next-line no-param-reassign
                        vanillaBrowserServer.foo = "bar";
                        return vanillaBrowserServer;
                    },
                },
            ],
        });
        try {
            assert.equal(browserServer.foo, "bar");
        } finally {
            await browserServer.close();
        }
    });
});
