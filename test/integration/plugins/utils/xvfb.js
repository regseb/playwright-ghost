/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import utilsXvfbPlugin from "../../../../src/plugins/utils/xvfb.js";

describe("Plugin: utils.xvfb", () => {
    it("should use screen size", async () => {
        const browser = await playwright.chromium.launch({
            headless: false,
            plugins: [utilsXvfbPlugin()],
        });
        // Définir le viewport à `null` pour utiliser la taille de l'écran
        // virtuel.
        const context = await browser.newContext({ viewport: null });
        try {
            const page = await context.newPage();
            await page.goto("https://example.com/");

            const screen = await page.evaluate(() => ({
                width: screen.width,
                height: screen.height,
            }));
            assert.equal(screen.width, 1920);
            assert.equal(screen.height, 1080);
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
