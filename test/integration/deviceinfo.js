/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../src/index.js";
import rebrowser from "../../src/rebrowser.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({
        args: ["--headless=new"],
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Device Info", function () {
    describe("chromium", function () {
        it("should not be spoofed", async function () {
            const browser = await rebrowser.chromium.launch({
                plugins: [
                    ...rebrowser.plugins.recommended(),
                    rebrowser.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.deviceinfo.me/");
                await page.waitForTimeout(5000);

                const spoofeds = await page.getByText("(Spoofed)").all();
                assert.deepEqual(spoofeds, []);
            } finally {
                await page.screenshot({
                    path: "./log/deviceinfo-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/deviceinfo-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        // Désactiver le test car il provoque une saturation de la mémoire.
        // "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap
        //  out of memory"
        it.skip("should not be spoofed", async function () {
            const browser = await vanilla.firefox.launch({
                plugins: vanilla.plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.deviceinfo.me/");
                await page.waitForTimeout(5000);

                const spoofeds = await page.getByText("(Spoofed)").all();
                assert.deepEqual(spoofeds, []);
            } finally {
                await page.screenshot({
                    path: "./log/deviceinfo-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/deviceinfo-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
