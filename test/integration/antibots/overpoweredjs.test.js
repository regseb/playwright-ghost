/**
 * @license MIT
 * @see https://overpoweredjs.com/demo.html
 * @see https://github.com/Joe12387/overpoweredjs
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import timers from "node:timers/promises";
import playwright from "../../../src/index.js";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";
import toolsCamoufoxPlugin from "../../../src/plugins/tools/camoufox.js";
import toolsWestonPlugin from "../../../src/plugins/tools/weston.js";

describe("Anti-bot: OverpoweredJS Fingerprinting Demo", () => {
    describe("chromium", () => {
        it("should be probably a human", async () => {
            const browser = await patchright.chromium.launch({
                headless: false,
                plugins: [
                    ...plugins.recommended(),
                    // Utiliser weston, car OverpoweredJS détecte que c'est un
                    // bot avec Xvfb. Il doit peut-être détecter une
                    // incohérence, car Chrome utilise Wayland dans Ubuntu.
                    toolsWestonPlugin(),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://overpoweredjs.com/demo.html");
                await timers.setTimeout(5000);

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
                plugins: [
                    ...plugins.recommended(),
                    toolsCamoufoxPlugin({ headless: true }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://overpoweredjs.com/demo.html");
                await timers.setTimeout(5000);

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
