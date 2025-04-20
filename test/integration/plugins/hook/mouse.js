/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../../src/index.js";

/**
 * @import { Mouse } from "playwright";
 */

describe("Plugin: hook.mouse", () => {
    it("should add plugin in Mouse", async () => {
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
