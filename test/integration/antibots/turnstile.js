/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import patchright from "../../../src/patchright.js";

const getUserAgent = async () => {
    const browser = await patchright.chromium.launch({ channel: "chromium" });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Cloudflare turnstile demo", function () {
    describe("chromium", function () {
        it("should be success with managed challenge", async function () {
            // Utiliser Patchright pour avoir accès aux shadow DOM fermés.
            // https://github.com/microsoft/playwright/issues/23047#issuecomment-2737175518
            const browser = await patchright.chromium.launch({
                plugins: [
                    ...patchright.plugins.recommended(),
                    patchright.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://peet.ws/turnstile-test/managed.html");

                const frame = page.frame({
                    url: "https://challenges.cloudflare.com/**",
                });
                await frame.locator('input[type="checkbox"]').check();
                // Attendre que la vérification commence et se termine.
                const verifying = frame.locator("#verifying");
                await verifying.waitFor({ state: "visible" });
                await verifying.waitFor({ state: "hidden" });

                assert.ok(await frame.locator("#success").isVisible());
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
            // Utiliser Patchright pour avoir accès aux shadow DOM fermés.
            // https://github.com/microsoft/playwright/issues/23047#issuecomment-2737175518
            const browser = await patchright.chromium.launch({
                plugins: [
                    ...patchright.plugins.recommended(),
                    patchright.plugins.polyfill.userAgent({
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

                const frame = page.frame({
                    url: "https://challenges.cloudflare.com/**",
                });
                // Attendre que la vérification commence et se termine.
                const verifying = frame.locator("#verifying");
                await verifying.waitFor({ state: "visible" });
                await verifying.waitFor({ state: "hidden" });

                assert.ok(await frame.locator("#success").isVisible());
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
