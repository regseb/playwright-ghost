/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import dialogPlugin from "../../../../src/plugins/humanize/dialog.js";

describe("Plugin: humanize.dialog", () => {
    it("should close slowly dialog", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [dialogPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            const delay = await page.evaluate(() => {
                const start = Date.now();
                // eslint-disable-next-line no-alert, no-undef
                alert("Are you human?");
                const end = Date.now();
                return { start, end };
            });

            assert.ok(
                1000 <= delay.end - delay.start,
                `1000 <= ${delay.end} - ${delay.start}`,
            );
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
