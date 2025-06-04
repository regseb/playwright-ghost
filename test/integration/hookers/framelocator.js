/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../src/index.js";

/**
 * @import { FrameLocator } from "playwright";
 */

describe("Hooker: frameLocator", () => {
    it("should add plugin in FrameLocator", async () => {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "FrameLocator:new": (
                        /** @type {FrameLocator} */ frameLocator,
                    ) => {
                        // eslint-disable-next-line no-param-reassign
                        frameLocator.foo = "bar";
                        return frameLocator;
                    },
                },
            ],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto(
                "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img",
            );
            const frameLocator = page.frameLocator('iframe[title="runner"]');
            assert.equal(frameLocator.foo, "bar");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
