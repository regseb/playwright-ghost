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
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://fingerprint-scan.com/");

                const score = await page
                    .locator("#fingerprintScore")
                    .textContent();
                const value = score?.slice(
                    score.indexOf(": ") + 2,
                    score.indexOf("/"),
                );

                assert.equal(value, "0");
            } finally {
                await page.screenshot({
                    path: "./log/fingerprintscan-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fingerprintscan-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
