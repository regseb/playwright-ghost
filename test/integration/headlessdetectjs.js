/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import playwright from "playwright";
import { chromium, plugins } from "../../src/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        args: ["--headless=new"],
        executablePath: playwright.chromium.executablePath(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("HeadlessDetectJS", function () {
    describe("chromium", function () {
        it("should get 0 score", async function () {
            const browser = await chromium.launch({
                plugins: [
                    ...plugins.recommendedPlugins(),
                    plugins.polyfill.userAgentPlugin({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();

            const response = await fetch(
                "https://raw.githubusercontent.com" +
                    "/LouisKlimek/HeadlessDetectJS" +
                    "/main/headlessDetect.js",
            );
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
                    path: "./log/headlessdetectjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/headlessdetectjs-cr.html",
                    await page.content(),
                );

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
