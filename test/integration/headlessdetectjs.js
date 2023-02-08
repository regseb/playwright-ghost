import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "../../src/index.js";

describe("HeadlessDetectJS", function () {
    describe("chromium", function () {
        it("should get 0 score", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();

            const response = await fetch("https://raw.githubusercontent.com" +
                                               "/LouisKlimek/HeadlessDetectJS" +
                                                     "/main/headlessDetect.js");
            const content = await response.text();
            context.addInitScript({ content });

            const page = await context.newPage();
            try {
                await page.goto("https://perdu.com/");

                const score = await page.evaluate(() => {
                    // eslint-disable-next-line no-undef
                    const headlessDetector = new HeadlessDetect();
                    return headlessDetector.getHeadlessScore();
                });

                assert.equal(score, 0);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/headlessdetectjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/headlessdetectjs-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
