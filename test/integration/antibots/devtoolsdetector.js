/**
 * @license MIT
 * @see https://blog.aepkill.com/demos/devtools-detector/
 * @see https://github.com/AEPKILL/devtools-detector
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: devtools-detector", () => {
    describe("chromium", () => {
        it("should not be 'close'", async () => {
            const browser = await patchright.chromium.launch({
                plugins: plugins.recommended(),
            });

            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://blog.aepkill.com/demos/devtools-detector/",
                );

                const status = await page.locator("#status").textContent();

                assert.equal(status, "devtools status: close");
            } finally {
                await page.screenshot({
                    path: "./log/devtoolsdetector-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/devtoolsdetector-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should not be 'close'", async () => {
            const browser = await playwright.firefox.launch({
                plugins: plugins.recommended(),
            });

            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://blog.aepkill.com/demos/devtools-detector/",
                );

                const status = await page.locator("#status").textContent();

                assert.equal(status, "devtools status: close");
            } finally {
                await page.screenshot({
                    path: "./log/devtoolsdetector-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/devtoolsdetector-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
