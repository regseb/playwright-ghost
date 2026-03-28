/**
 * @license MIT
 * @see https://csswaf-demo.othing.xyz/
 * @see https://github.com/yzqzss/csswaf
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: CSSWAF", () => {
    describe("chromium", () => {
        it("should be redirect to 'Hello, world!'", async () => {
            const browser = await playwright.chromium.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://csswaf-demo.othing.xyz/");
                const title = await page
                    .locator("body", { hasText: "Hello, world!" })
                    .textContent();

                assert.equal(title, "Hello, world!");
            } finally {
                await page.screenshot({
                    path: "./log/csswaf-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/csswaf-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should be redirect to 'Hello, world!'", async () => {
            const browser = await playwright.firefox.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://csswaf-demo.othing.xyz/");
                const title = await page
                    .locator("body", { hasText: "Hello, world!" })
                    .textContent();

                assert.equal(title, "Hello, world!");
            } finally {
                await page.screenshot({
                    path: "./log/csswaf-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/csswaf-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
