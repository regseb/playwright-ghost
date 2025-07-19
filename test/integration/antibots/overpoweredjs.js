/**
 * @license MIT
 * @see https://overpoweredjs.com/demo.html
 * @see https://github.com/Joe12387/overpoweredjs
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        plugins: plugins.recommended(),
        channel: "chrome",
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: OverpoweredJS Fingerprinting Demo", () => {
    describe("chromium", () => {
        it("should be probably a human", async () => {
            const browser = await playwright.chromium.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
                // Utiliser Chrome, car OverpoweredJS détecte que c'est un bot
                // quand Playwright est utilisé avec le navigateur Chromium.
                channel: "chrome",
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://overpoweredjs.com/demo.html");
                await page.waitForTimeout(5000);

                const result = await page
                    .locator("h2", { hasText: /Bot|Human/v })
                    .textContent();
                assert.equal(result, "Human");
            } finally {
                await page.screenshot({
                    path: "./log/overpoweredjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/overpoweredjs-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should be probably a human", async () => {
            const browser = await playwright.firefox.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://overpoweredjs.com/demo.html");
                await page.waitForTimeout(5000);

                const result = await page
                    .locator("h2", { hasText: /Bot|Human/v })
                    .textContent();
                assert.equal(result, "Human");
            } finally {
                await page.screenshot({
                    path: "./log/overpoweredjs-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/overpoweredjs-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
