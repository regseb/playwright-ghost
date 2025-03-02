/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../../src/index.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({ channel: "chromium" });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Cloudflare turnstile demo", function () {
    describe("chromium", function () {
        it.skip("should be success with managed challenge", async function () {
            const browser = await vanilla.chromium.launch({
                plugins: [
                    ...vanilla.plugins.recommended(),
                    vanilla.plugins.polyfill.userAgent({
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
            const browser = await vanilla.chromium.launch({
                plugins: [
                    ...vanilla.plugins.recommended(),
                    vanilla.plugins.polyfill.userAgent({
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
});
