/**
 * @license MIT
 * @see https://detectincognito.com/
 * @see https://github.com/Joe12387/detectIncognito
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: detectIncognito", () => {
    describe("chromium", () => {
        it("should not be detected", async () => {
            const context = await patchright.chromium.launchPersistentContext(
                "",
                { plugins: plugins.recommended() },
            );
            const page = await context.newPage();
            try {
                await page.goto("https://detectincognito.com/");

                const answer = await page.locator("#answer b").textContent();
                assert.equal(answer, "No");
            } finally {
                await page.screenshot({
                    path: "./log/detectincognito-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/detectincognito-cr.html",
                    await page.content(),
                );

                await context.close();
            }
        });
    });

    describe("firefox", () => {
        it("should not be detected", async () => {
            const browser = await playwright.firefox.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://detectincognito.com/");

                const answer = await page.locator("#answer b").textContent();
                assert.equal(answer, "No");
            } finally {
                await page.screenshot({
                    path: "./log/detectincognito-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/detectincognito-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
