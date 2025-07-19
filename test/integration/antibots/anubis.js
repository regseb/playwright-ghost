/**
 * @license MIT
 * @see https://anubis.techaro.lol/
 * @see https://github.com/TecharoHQ/anubis
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        plugins: plugins.recommended(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Anubis", () => {
    describe("chromium", () => {
        it("should be redirect to home", async () => {
            const browser = await playwright.chromium.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://anubis.techaro.lol/");
                // Attendre le résultat du dernier test.
                const title = await page.locator(".hero__title").textContent();

                assert.equal(title, "Anubis");
            } finally {
                await page.screenshot({
                    path: "./log/anubis-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/anubis-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
