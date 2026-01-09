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

describe("Anti-bot: OverpoweredJS Fingerprinting Demo", () => {
    describe("chromium", () => {
        it("should be probably a human", async () => {
            // Utiliser launchPersistentContext(), car OverpoweredJS considère
            // que c'est une navigation incognito avec launch().
            const context = await playwright.chromium.launchPersistentContext(
                "",
                {
                    headless: false,
                    plugins: [
                        ...plugins.recommended(),
                        // Utiliser weston, car OverpoweredJS détecte que c'est
                        // un bot avec Xvfb. Il doit peut-être détecter une
                        // incohérence : Chrome utilise Wayland dans Ubuntu.
                        plugins.utils.weston(),
                    ],
                },
            );
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
            }
        });
    });

    // Désactiver le test, car la démo ne fonctionne pas sous Firefox.
    // https://github.com/Joe12387/overpoweredjs/issues/3
    describe.skip("firefox", () => {
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
