/**
 * @license MIT
 * @see https://browser-compat.turnstile.workers.dev/
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

/**
 * @import { Frame } from "../../../src/patchright.js"
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

describe("Anti-bot: Turnstile Troubleshooter", () => {
    describe("chromium", () => {
        it("should diagnostics passed", async () => {
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
                await page.goto(
                    "https://browser-compat.turnstile.workers.dev/",
                );

                // Ouvrir les détails techniques.
                await page.locator("#tech-details").click();

                // Valider le captcha de Cloudflare.
                const frame = /** @type {Frame} */ (
                    page.frame({ url: "https://challenges.cloudflare.com/**" })
                );
                try {
                    await frame.locator('input[type="checkbox"]').check();
                } catch {
                    // Ne rien faire, car il n'y pas de case à cocher.
                }
                await frame.locator(`path[d="${CHECK_MARK_PATH}"]`).waitFor();

                await page.locator("#success-card").waitFor();
            } finally {
                await page.screenshot({
                    path: "./log/troubleshooter-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/troubleshooter-cr.html",
                    await page.content({ includeShadow: true }),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
