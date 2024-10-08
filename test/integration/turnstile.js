/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../src/index.js";
import rebrowser from "../../src/rebrowser.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({
        args: ["--headless=new"],
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
        it.skip("should be success with managed challenge", async function () {
            const browser = await rebrowser.chromium.launch({
                plugins: [
                    ...rebrowser.plugins.recommendeds(),
                    rebrowser.plugins.polyfill.userAgent({
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
            } finally {
                await page.screenshot({
                    path: "./log/turnstile_managed-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/turnstile_managed-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });

        it("should be success with non-interactive challenge", async function () {
            const browser = await rebrowser.chromium.launch({
                plugins: [
                    ...rebrowser.plugins.recommendeds(),
                    rebrowser.plugins.polyfill.userAgent({
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
            } finally {
                await page.screenshot({
                    path: "./log/turnstile_noninteractive-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/turnstile_noninteractive-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it.skip("should be success with managed challenge", async function () {
            const browser = await vanilla.firefox.launch({
                plugins: vanilla.plugins.recommendeds(),
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
            } finally {
                await page.screenshot({
                    path: "./log/turnstile_managed-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/turnstile_managed-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });

        it("should be success with non-interactive challenge", async function () {
            const browser = await vanilla.firefox.launch({
                plugins: vanilla.plugins.recommendeds(),
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
            } finally {
                await page.screenshot({
                    path: "./log/turnstile_noninteractive-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/turnstile_noninteractive-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
