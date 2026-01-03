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
                    .locator(".loader.hide")
                    .waitFor({ state: "attached" });
                // Ne pas vérifier le statut général (comme avec Firefox), car
                // il y a un faux-positif avec le HARDWARE "It seems you are
                // masking your fingerprint" qui est aussi en consultant le site
                // avec le navigateur Chromium.
                const status = await page
                    .locator(
                        ".identity-check__item" +
                            `[onclick="window.location='#browser'"] strong`,
                    )
                    .textContent();

                assert.equal(status, "as real");
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
                plugins: [...plugins.recommended(), plugins.utils.camoufox()],
                headless: true,
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://iphey.com/");
                await page
                    .locator(".loader.hide")
                    .waitFor({ state: "attached" });
                const status = await page
                    .locator(".identity-status__status:not(.hide) span")
                    .textContent();

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
