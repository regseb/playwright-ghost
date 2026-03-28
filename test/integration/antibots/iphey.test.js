/**
 * @license MIT
 * @see https://iphey.com/
 * @see https://github.com/mixvisit-service/mixvisit
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: Check browser fingerprints (iphey)", () => {
    describe("chromium", () => {
        it("should be Trustworthy", async () => {
            const browser = await playwright.chromium.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://iphey.com/");
                await page
                    .locator(".hero-overlay")
                    .waitFor({ state: "hidden" });

                const status = await page.locator("#hero-status").textContent();

                assert.equal(status, "Trustworthy");
            } finally {
                await page.screenshot({
                    path: "./log/iphey-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/iphey-cr.html", await page.content());

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should be Trustworthy", async () => {
            const browser = await playwright.firefox.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://iphey.com/");
                await page
                    .locator(".hero-overlay")
                    .waitFor({ state: "hidden", timeout: 60_000 });

                const status = await page.locator("#hero-status").textContent();

                assert.equal(status, "Trustworthy");
            } finally {
                await page.screenshot({
                    path: "./log/iphey-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/iphey-fx.html", await page.content());

                await context.close();
                await browser.close();
            }
        });
    });
});
