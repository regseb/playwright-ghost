/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

/**
 * @import { Mouse } from "playwright";
 */

describe("Plugin: hook.mouse", function () {
    it("should add plugin in Mouse", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Mouse:new": (/** @type {Mouse} */ mouse) => {
                        // eslint-disable-next-line no-param-reassign
                        mouse.foo = "bar";
                        return mouse;
                    },
                },
            ],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            assert.equal(page.mouse.foo, "bar");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
