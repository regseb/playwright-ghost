/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import humanizeCursorPlugin from "../../../../src/plugins/humanize/cursor.js";

describe("Plugin: humanize.cursor", () => {
    it("should move to click on buttons", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [humanizeCursorPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://camoufox.com/tests/buttonclick");
            await page.evaluate(() => {
                globalThis.events = [];
                // eslint-disable-next-line no-undef
                document.addEventListener("mousemove", (event) => {
                    globalThis.events.push({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        timeStamp: event.timeStamp,
                    });
                });
            });
            for (let i = 0; 10 > i; ++i) {
                await page.locator("button").click();
            }

            const events = await page.evaluate(() => globalThis.events);
            for (let i = 1; i < events.length; i++) {
                assert.ok(
                    events[i].clientX !== events[i - 1].clientX ||
                        events[i].clientY !== events[i - 1].clientY,
                    `${events[i].clientX} !== ${events[i - 1].clientX} ||
                        ${events[i].clientY} !== ${events[i - 1].clientY}`,
                );
                assert.ok(
                    events[i].timeStamp > events[i - 1].timeStamp,
                    `${events[i].timeStamp} > ${events[i - 1].timeStamp}`,
                );
            }
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
