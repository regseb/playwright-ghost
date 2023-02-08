import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "../../src/index.js";

describe("Datadome", function () {
    describe("chromium", function () {
        it("should not see CAPTCHA", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://antoinevastel.com/bots/datadome");

                const title = await page.locator("h1").textContent();
                assert.equal(title, "Datadome test page");
            } catch (err) {
                await page.screenshot({
                    path:     "./log/datadome-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/datadome-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
