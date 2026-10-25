/**
 * @license MIT
 * @see https://fingerprint-scan.com/
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

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

describe("Anti-bot: Fingerprint-Scan", () => {
    describe("chromium", () => {
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
                await page.goto("https://fingerprint-scan.com/");

                await page
                    .getByText("Fingerprint collected successfully")
                    .waitFor();

                const result = await page.getByText("Bot score ").textContent();
                const score = Number(result.slice(10, result.indexOf("/")));
                // Comparer avec la valeur obtenue sur un navigateur normal.
                assert.ok(26 >= score, `26 >= ${score}`);
            } finally {
                await page.screenshot({
                    path: "./log/fingerprintscan-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fingerprintscan-cr.html",
                    await page.content({ includeShadow: true }),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
