/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../src/index.js";

/**
 * @import { Locator } from "playwright";
 */

describe("Hooker: locator", () => {
    it("should add plugin in Locator", async () => {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Locator:new": (/** @type {Locator} */ locator) => {
                        // eslint-disable-next-line no-param-reassign
                        locator.foo = "bar";
                        return locator;
                    },
                },
            ],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("about:blank");
            const locator = page.locator("html");
            assert.equal(locator.foo, "bar");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
