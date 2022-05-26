import assert from "node:assert";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

/* global HeadlessDetect */

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
                    const headlessDetector = new HeadlessDetect();
                    return headlessDetector.getHeadlessScore();
                });

                assert.strictEqual(score, 0);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/headlessdetectjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/headlessdetectjs-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should get 0 score", async function () {
            const browser = await firefox.launch();
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
                    const headlessDetector = new HeadlessDetect();
                    return headlessDetector.getHeadlessScore();
                });

                assert.strictEqual(score, 0);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/headlessdetectjs-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/headlessdetectjs-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
