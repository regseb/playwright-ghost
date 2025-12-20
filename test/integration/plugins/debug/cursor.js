/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import debugCursorPlugin from "../../../../src/plugins/debug/cursor.js";

describe("Plugin: debug.cursor", () => {
    it("should ignore click on div", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [debugCursorPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://example.com/");
            await page.getByText("Learn more").click();

            assert.equal(
                page.url(),
                "https://www.iana.org/help/example-domains",
            );
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
