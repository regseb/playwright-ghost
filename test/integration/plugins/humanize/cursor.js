/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../../src/index.js";

describe("Plugin: humanize.cursor", () => {
    it("should not move in the same position", async () => {
        const browser = await vanilla.chromium.launch({
            plugins: [vanilla.plugins.humanize.cursor()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://example.com/");
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
            await page.locator("h1").click();

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
