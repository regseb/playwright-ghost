/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: Shadow DOM", () => {
    describe("chromium", () => {
        it("should dig in Shadow DOM", async () => {
            const browser = await patchright.chromium.launch({
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://htmx.org/examples/web-components/");
                const text = await page
                    .locator("#demo-canvas button")
                    .textContent();

                assert.equal(text, "Click me!");
            } finally {
                await page.screenshot({
                    path: "./log/shadowdom-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/shdowdom-cr.html",
                    await page.content({ includeShadow: true }),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
