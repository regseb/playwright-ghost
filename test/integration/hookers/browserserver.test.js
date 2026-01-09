/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../src/index.js";

/**
 * @import { BrowserServer } from "playwright";
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
            // Vérifier que le type de l'instance a été maquillé.
            assert.equal(browserServer.constructor.name, "BrowserServer");
            assert.equal(browserServer.foo, "bar");
        } finally {
            await browserServer.close();
        }
    });
});
