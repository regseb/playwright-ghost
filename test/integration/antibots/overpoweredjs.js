/**
 * @license MIT
 * @see https://github.com/Joe12387/overpoweredjs
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";

const getUserAgent = async () => {
    const browser = await patchright.chromium.launch({ channel: "chromium" });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: OverpoweredJS Fingerprinting Demo", () => {
    describe("chromium", () => {
        it("should be probably a human", async () => {
            const browser = await patchright.chromium.launch({
                plugins: [
                    ...patchright.plugins.recommended(),
                    patchright.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
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
});
