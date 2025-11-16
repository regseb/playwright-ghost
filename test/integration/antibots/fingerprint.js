/**
 * @license MIT
 * @see https://demo.fingerprint.com/playground
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
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Fingerprint", () => {
    describe("chromium", () => {
        it("should not be detected", async () => {
            const browser = await playwright.chromium.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://demo.fingerprint.com/playground");

                const result = await page
                    .locator('div[data-test-property-name="botd"]')
                    .textContent();

                assert.equal(result, "Not detected");
            } finally {
                await page.screenshot({
                    path: "./log/fingerprintplayground-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fingerprintplayground-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should not be detected", async () => {
            const browser = await playwright.firefox.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.utils.camoufox({ headless: true }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://demo.fingerprint.com/playground");

                const result = await page
                    .locator('div[data-test-property-name="botd"]')
                    .textContent();

                assert.equal(result, "Not detected");
            } finally {
                await page.screenshot({
                    path: "./log/fingerprintplayground-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fingerprintplayground-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
