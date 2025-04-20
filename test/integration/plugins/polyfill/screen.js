/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../../src/index.js";

describe("Plugin: polyfill.screen", () => {
    it("should set screen size", async () => {
        const browser = await vanilla.chromium.launch({
            channel: "chromium",
            plugins: [vanilla.plugins.polyfill.screen()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("about:blank");
            assert.equal(await page.evaluate("screen.width"), 1920);
            assert.equal(await page.evaluate("screen.height"), 1080);
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
