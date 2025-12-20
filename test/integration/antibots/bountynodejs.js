/**
 * @license MIT
 * @see https://bounty-nodejs.datashield.co/
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: bounty-nodejs", () => {
    describe("chromium", () => {
        it("should be scrappable", async () => {
            const browser = await patchright.chromium.launch({
                headless: false,
                plugins: [...plugins.recommended(), plugins.utils.xvfb()],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://bounty-nodejs.datashield.co/");
                const text = await page
                    .locator('a[href="/scraping"]')
                    .textContent();

                assert.equal(text, "scraping");
            } finally {
                await page.screenshot({
                    path: "./log/bountynodejs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/bountynodejs-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
