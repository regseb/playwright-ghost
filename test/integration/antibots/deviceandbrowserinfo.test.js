/**
 * @license MIT
 * @see https://deviceandbrowserinfo.com/are_you_a_bot
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

const getUserAgent = async () => {
    const browser = await patchright.chromium.launch({
        plugins: plugins.recommended(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Deviceandbrowserinfo", () => {
    describe("chromium", () => {
        it("should be human", async () => {
            const browser = await patchright.chromium.launch({
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
                await page.goto(
                    "https://deviceandbrowserinfo.com/are_you_a_bot",
                );
                const result = await page
                    .locator("#resultsBotTest:has(span)")
                    .textContent();
                assert.equal(result, "✅ You are human!");
            } finally {
                await page.screenshot({
                    path: "./log/deviceandbrowserinfo-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/deviceandbrowserinfo-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should be human", async () => {
            const browser = await playwright.firefox.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.utils.camoufox({ headless: true }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://deviceandbrowserinfo.com/are_you_a_bot",
                );
                const result = await page
                    .locator("#resultsBotTest:has(span)")
                    .textContent();
                assert.equal(result, "✅ You are human!");
            } finally {
                await page.screenshot({
                    path: "./log/deviceandbrowserinfo-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/deviceandbrowserinfo-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
