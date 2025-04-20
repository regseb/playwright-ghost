/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../../src/index.js";

/**
 * @import { Page } from "playwright";
 */

describe("Plugin: hook.page", () => {
    it("should add plugin in Page", async () => {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Page:new": (/** @type {Page} */ page) => {
                        // eslint-disable-next-line no-param-reassign
                        page.foo = "bar";
                        return page;
                    },
                },
            ],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            assert.equal(page.foo, "bar");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
