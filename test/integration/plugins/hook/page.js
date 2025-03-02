/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

describe("Plugin: hook.page", function () {
    it("should add plugin in Page", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Page:new": (page) => {
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
