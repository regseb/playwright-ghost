/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../../src/index.js";

describe("Plugin: humanize.click", () => {
    it("should click slowly", async () => {
        const browser = await vanilla.chromium.launch({
            plugins: [vanilla.plugins.humanize.click()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://example.com/");
            await page.evaluate(() => {
                globalThis.events = [];
                // eslint-disable-next-line no-undef
                document.addEventListener("mousedown", (event) => {
                    globalThis.events.push({ timeStamp: event.timeStamp });
                });
                // eslint-disable-next-line no-undef
                document.addEventListener("mouseup", (event) => {
                    globalThis.events.push({ timeStamp: event.timeStamp });
                });
            });
            await page.locator("h1").click();

            const events = await page.evaluate(() => globalThis.events);
            assert.equal(events.length, 2);
            assert.ok(
                100 <= events[1].timeStamp - events[0].timeStamp,
                `100 <= ${events[1].timeStamp} - ${events[0].timeStamp}`,
            );
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
