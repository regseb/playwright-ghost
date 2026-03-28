/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import toolsLightpandaPlugin from "../../../../src/plugins/tools/lightpanda.js";

describe("Plugin: tools.lightpanda", () => {
    it("should connect to lightpanda", async () => {
        const browser = await playwright.chromium.connectOverCDP("", {
            plugins: [toolsLightpandaPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://example.com/");

            const title = await page.locator("h1").textContent();
            assert.equal(title, "Example Domain");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
