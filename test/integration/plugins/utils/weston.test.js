/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import utilsWestonPlugin from "../../../../src/plugins/utils/weston.js";

describe("Plugin: utils.weston", () => {
    it("should use screen size with launch()", async () => {
        const browser = await playwright.chromium.launch({
            headless: false,
            plugins: [utilsWestonPlugin()],
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

    it("should use screen size with launchPersistentContext()", async () => {
        const context = await playwright.chromium.launchPersistentContext("", {
            headless: false,
            // Définir le viewport à `null` pour utiliser la taille de l'écran
            // virtuel.
            viewport: null,
            plugins: [utilsWestonPlugin()],
        });
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
        }
    });

    it("should use screen size with launchServer()", async () => {
        const server = await playwright.chromium.launchServer({
            headless: false,
            plugins: [utilsWestonPlugin()],
        });
        const browser = await playwright.chromium.connect(server.wsEndpoint());
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
            await server.close();
        }
    });
});
