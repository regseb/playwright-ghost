import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "../../src/index.js";

describe("Device Info", function () {
    describe("chromium", function () {
        it("should not be spoofed", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.deviceinfo.me/");
                await page.waitForTimeout(5000);

                const spoofeds = await page.getByText("(Spoofed)").all();
                assert.deepEqual(spoofeds, []);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/deviceinfo-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/deviceinfo-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
