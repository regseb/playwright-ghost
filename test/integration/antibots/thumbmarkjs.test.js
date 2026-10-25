/**
 * @license MIT
 * @see https://www.thumbmarkjs.com/
 * @see https://github.com/thumbmarkjs/thumbmarkjs
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: ThumbmarkJS", () => {
    describe("chromium", () => {
        it("should not be a bot", async () => {
            const browser = await playwright.chromium.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.thumbmarkjs.com/");

                const result = await page
                    .locator("astro-island")
                    .getByText("Bot", { exact: true })
                    .locator("+ div", { hasNotText: "..." })
                    .textContent();

                assert.equal(result, "No");
            } finally {
                await page.screenshot({
                    path: "./log/thumbmarkjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/thumbmarkjs-cr.html",
                    await page.content({ includeShadow: true }),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should not be a bot", async () => {
            const browser = await playwright.firefox.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.thumbmarkjs.com/");

                const result = await page
                    .locator("astro-island")
                    .getByText("Bot", { exact: true })
                    .locator("+ div", { hasNotText: "..." })
                    .textContent();

                assert.equal(result, "No");
            } finally {
                await page.screenshot({
                    path: "./log/thumbmarkjs-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/thumbmarkjs-fx.html",
                    await page.content({ includeShadow: true }),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
