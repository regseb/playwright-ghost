import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "../../src/index.js";

describe("nowSecure", function () {
    describe("chromium", function () {
        it("should be passed", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://nowsecure.nl/");
                await page.waitForTimeout(5000);

                const title = await page.locator("h1").textContent();
                assert.equal(title, "OH YEAH, you passed!");
            } catch (err) {
                await page.screenshot({
                    path:     "./log/nowsecure-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/nowsecure-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
