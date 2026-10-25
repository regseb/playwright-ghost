/**
 * @license MIT
 * @see https://2captcha.com/demo/cloudflare-turnstile
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

/**
 * @import { Frame } from "patchright";
 */

/**
 * Chemin SVG de la coche de validation du challenge Cloudflare.
 *
 * @type {string}
 */
const CHECK_MARK_PATH = "m13,26l9.37,9l17.63,-18";

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

describe("Anti-bot: 2Captcha Cloudflare demo", () => {
    describe("chromium", () => {
        it("should be passed with Cloudflare Turnstile", async () => {
            // Utiliser Patchright pour avoir accès aux shadow DOM fermés.
            // https://github.com/microsoft/playwright/issues/23047#issuecomment-2737175518
            const browser = await patchright.chromium.launch({
                plugins: [
                    // ...plugins.recommended(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://2captcha.com/demo/cloudflare-turnstile",
                );

                await page
                    .locator(
                        'iframe[src^="https://challenges.cloudflare.com/"]',
                    )
                    .waitFor();
                const frame = /** @type {Frame} */ (
                    page.frame({ url: "https://challenges.cloudflare.com/**" })
                );
                try {
                    await frame.locator('input[type="checkbox"]').check();
                } catch {
                    // Ne rien faire, car il n'y pas de case à cocher.
                }

                await frame.locator(`path[d="${CHECK_MARK_PATH}"]`).waitFor();
            } finally {
                await page.screenshot({
                    path: "./log/twocaptcha-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/twocaptcha-cr.html",
                    await page.content({ includeShadow: true }),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
