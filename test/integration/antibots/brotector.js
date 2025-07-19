/**
 * @license MIT
 * @see https://kaliiiiiiiiii.github.io/brotector/
 * @see https://github.com/kaliiiiiiiiii/brotector
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: Brotector", () => {
    describe("chromium", () => {
        it("should have 0", async () => {
            const browser = await patchright.chromium.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://kaliiiiiiiiii.github.io/brotector/");
                await page.locator("#clickHere").click();
                await page.waitForTimeout(1000);
                const score = await page.locator("#avg-score").textContent();
                assert.equal(score, "0");
            } finally {
                await page.screenshot({
                    path: "./log/brotector-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/brotector-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should have 0", async () => {
            const browser = await playwright.firefox.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.utils.camoufox({ headless: true }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://kaliiiiiiiiii.github.io/brotector/");
                await page.locator("#clickHere").click();
                await page.waitForTimeout(1000);
                const score = await page.locator("#avg-score").textContent();
                assert.equal(score, "0");
            } finally {
                await page.screenshot({
                    path: "./log/brotector-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/brotector-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
