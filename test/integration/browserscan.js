/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import playwright from "playwright";
import { chromium, firefox, plugins } from "../../src/index.js";

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

describe("BrowserScan", function () {
    describe("chromium", function () {
        it("should pass", async function () {
            const browser = await chromium.launch({
                plugins: [
                    ...plugins.recommendeds(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.browserscan.net/bot-detection");
                await page.waitForTimeout(5000);
                const result = await page
                    .getByText("Test Results:", { exact: true })
                    .evaluate(
                        (element) =>
                            element.parentElement.querySelector(
                                "strong:last-child",
                            ).textContent,
                    );
                if ("Normal" !== result) {
                    assert.fail(result);
                }
            } catch (err) {
                await page.screenshot({
                    path: "./log/browserscan-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/browserscan-cr.html",
                    await page.content(),
                );
                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should pass", async function () {
            const browser = await firefox.launch({
                plugins: plugins.recommendeds(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.browserscan.net/bot-detection");
                await page.waitForTimeout(5000);
                const result = await page
                    .getByText("Test Results:", { exact: true })
                    .evaluate(
                        (element) =>
                            element.parentElement.querySelector(
                                "strong:last-child",
                            ).textContent,
                    );
                if ("Normal" !== result) {
                    assert.fail(result);
                }
            } catch (err) {
                await page.screenshot({
                    path: "./log/browserscan-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/browserscan-fx.html",
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
