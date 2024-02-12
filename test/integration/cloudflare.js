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

describe("Cloudflare", function () {
    describe("chromium", function () {
        it("should be success with managed challenge", async function () {
            const browser = await chromium.launch({
                plugins: [
                    ...plugins.recommendedPlugins(),
                    plugins.polyfill.userAgentPlugin({
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
                    assert.ok(await frame.getByText("Success!").isVisible());
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
                    ...plugins.recommendedPlugins(),
                    plugins.polyfill.userAgentPlugin({
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
                    assert.ok(await frame.getByText("Success!").isVisible());
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
});
