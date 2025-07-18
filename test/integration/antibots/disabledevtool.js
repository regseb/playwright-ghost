/**
 * @license MIT
 * @see https://theajack.github.io/disable-devtool/
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: Disable-devtool", () => {
    describe("chromium", () => {
        it("should not be close", async () => {
            const browser = await patchright.chromium.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://theajack.github.io/disable-devtool/");
                // Attendre que Disable-devtool soit activé.
                await page.waitForTimeout(10_000);

                await page.locator("#md5_key").fill("foo");
                await page.getByRole("button", { name: "Generate" }).click();
                const value = await page.locator("#md5_value").textContent();
                assert.equal(value, "acbd18db4cc2f85cedef654fccc4a4d8");
            } finally {
                await page.screenshot({
                    path: "./log/disabledevtool-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/disabledevtool-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
