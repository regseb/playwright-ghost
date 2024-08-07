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

describe("Cloudflare turnstile demo", function () {
    describe("chromium", function () {
        it("should be success with managed challenge", async function () {
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
                await page.goto("https://peet.ws/turnstile-test/managed.html");
                await page.waitForTimeout(5000);

                const CHALLENGES_HOST = "https://challenges.cloudflare.com/";
                for (const frame of page.mainFrame().childFrames()) {
                    if (!frame.url().startsWith(CHALLENGES_HOST)) {
                        continue;
                    }
                    await frame.click('input[type="checkbox"]');
                    assert.ok(await frame.locator("#success").isVisible());
                }
            } catch (err) {
                await page.screenshot({
                    path: "./log/cloudflare_managed-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/cloudflare_managed-cr.html",
                    await page.content(),
                );

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });

        it("should be success with non-interactive challenge", async function () {
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
                await page.goto(
                    "https://peet.ws/turnstile-test/non-interactive.html",
                );
                await page.waitForTimeout(5000);

                const CHALLENGES_HOST = "https://challenges.cloudflare.com/";
                for (const frame of page.mainFrame().childFrames()) {
                    if (!frame.url().startsWith(CHALLENGES_HOST)) {
                        continue;
                    }
                    assert.ok(await frame.locator("#success").isVisible());
                }
            } catch (err) {
                await page.screenshot({
                    path: "./log/cloudflare_noninteractive-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/cloudflare_noninteractive-cr.html",
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
        it("should be success with managed challenge", async function () {
            const browser = await firefox.launch({
                plugins: plugins.recommendeds(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://peet.ws/turnstile-test/managed.html");
                await page.waitForTimeout(5000);

                const CHALLENGES_HOST = "https://challenges.cloudflare.com/";
                for (const frame of page.mainFrame().childFrames()) {
                    if (!frame.url().startsWith(CHALLENGES_HOST)) {
                        continue;
                    }
                    await frame.click('input[type="checkbox"]');
                    assert.ok(await frame.locator("#success").isVisible());
                }
            } catch (err) {
                await page.screenshot({
                    path: "./log/cloudflare_managed-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/cloudflare_managed-fx.html",
                    await page.content(),
                );

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });

        it("should be success with non-interactive challenge", async function () {
            const browser = await firefox.launch({
                plugins: plugins.recommendeds(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://peet.ws/turnstile-test/non-interactive.html",
                );
                await page.waitForTimeout(5000);

                const CHALLENGES_HOST = "https://challenges.cloudflare.com/";
                for (const frame of page.mainFrame().childFrames()) {
                    if (!frame.url().startsWith(CHALLENGES_HOST)) {
                        continue;
                    }
                    assert.ok(await frame.locator("#success").isVisible());
                }
            } catch (err) {
                await page.screenshot({
                    path: "./log/cloudflare_noninteractive-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/cloudflare_noninteractive-fx.html",
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
