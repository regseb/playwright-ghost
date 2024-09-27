/**
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

describe("Datadome", function () {
    describe("chromium", function () {
        it("should not see CAPTCHA", async function () {
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
                await page.goto("https://antoinevastel.com/bots/datadome");

                const title = await page.locator("h1").textContent();
                assert.equal(title, "Bot detection test page");
            } catch (err) {
                await page.screenshot({
                    path: "./log/datadome-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/datadome-cr.html",
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
        it("should not see CAPTCHA", async function () {
            const browser = await firefox.launch({
                plugins: plugins.recommendeds(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://antoinevastel.com/bots/datadome");

                const title = await page.locator("h1").textContent();
                assert.equal(title, "Bot detection test page");
            } catch (err) {
                await page.screenshot({
                    path: "./log/datadome-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/datadome-fx.html",
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
