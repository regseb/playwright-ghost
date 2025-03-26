/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

/**
 * @import { Frame } from "playwright";
 */

describe("Plugin: hook.frame", function () {
    it("should add plugin in Frame", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Frame:new": (/** @type {Frame} */ frame) => {
                        // eslint-disable-next-line no-param-reassign
                        frame.foo = "bar";
                        return frame;
                    },
                },
            ],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            const frame = page.mainFrame();
            assert.equal(frame.foo, "bar");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
