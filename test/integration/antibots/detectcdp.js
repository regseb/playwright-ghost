/**
 * @license MIT
 * @see https://bypassantibot.github.io/detectCDP/
 * @see https://github.com/bypassantibot/detectCDP
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: Detect CDP", () => {
    describe("chromium", () => {
        it("should not be detected", async () => {
            const browser = await patchright.chromium.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://bypassantibot.github.io/detectCDP/");

                const status = await page.locator("#status").textContent();
                assert.equal(status, "no");
            } finally {
                await page.screenshot({
                    path: "./log/detectcdp-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/detectcdp-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
