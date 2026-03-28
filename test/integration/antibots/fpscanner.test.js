/**
 * @license MIT
 * @see https://fpscanner.com/demo/
 * @see https://github.com/antoinevastel/fpscanner
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";
import toolsCamoufoxPlugin from "../../../src/plugins/tools/camoufox.js";

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

describe("Anti-bot: FPScanner", () => {
    describe.skip("chromium", () => {
        it("should not be detected", async () => {
            const browser = await patchright.chromium.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                    plugins.polyfill.webGL(),
                ],
            });

            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://fpscanner.com/demo/");

                await page.waitForSelector("#bot-detection .bot-alert");
                const results = await page
                    .locator("#bot-detection .detection-item")
                    .evaluateAll((items) => {
                        return items.map((item) => ({
                            label: item.querySelector(".label")?.textContent,
                            badge: item.querySelector(".badge")?.textContent,
                        }));
                    });

                for (const result of results) {
                    assert.equal(
                        result.badge,
                        "OK",
                        `${result.label}: ${result.badge}`,
                    );
                }
            } finally {
                await page.screenshot({
                    path: "./log/fpscanner-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fpscanner-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should not be detected", async () => {
            const browser = await playwright.firefox.launch({
                plugins: [
                    ...plugins.recommended(),
                    toolsCamoufoxPlugin({ headless: true }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://fpscanner.com/demo/");

                await page.waitForSelector("#bot-detection .bot-alert");
                const results = await page
                    .locator("#bot-detection .detection-item")
                    .evaluateAll((items) => {
                        return items.map((item) => ({
                            label: item.querySelector(".label")?.textContent,
                            badge: item.querySelector(".badge")?.textContent,
                        }));
                    });

                for (const result of results) {
                    assert.equal(
                        result.badge,
                        "OK",
                        `${result.label}: ${result.badge}`,
                    );
                }
            } finally {
                await page.screenshot({
                    path: "./log/fpscanner-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fpscanner-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
