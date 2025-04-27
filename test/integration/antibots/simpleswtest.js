/**
 * @license MIT
 * @see https://mihneamanolache.github.io/simple-sw-test/
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import vanilla from "../../../src/index.js";

describe("Anti-bot: Simple Service Workers Fingerprinting Leaks Test", () => {
    describe("chromium", () => {
        it("should not be detected", async () => {
            const browser = await vanilla.chromium.launch({
                plugins: vanilla.plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://mihneamanolache.github.io/simple-sw-test/",
                );
                await page.waitForTimeout(2000);

                const consistent = await page
                    .locator("#consisency")
                    .textContent();

                assert.equal(consistent, "True");
            } finally {
                await page.screenshot({
                    path: "./log/simpleswtest-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/simpleswtest-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
