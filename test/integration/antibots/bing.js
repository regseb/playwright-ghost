/**
 * @license MIT
 * @see https://www.bing.com/turing/captcha/challenge
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

/**
 * @import { Frame } from "patchright";
 */

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

describe("Anti-bot: Bing", () => {
    describe("chromium", () => {
        it("should be success", async () => {
            // Utiliser Patchright pour avoir accès aux shadow DOM fermés.
            // https://github.com/microsoft/playwright/issues/23047#issuecomment-2737175518
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
                await page.goto(
                    "https://www.bing.com/turing/captcha/challenge",
                );

                const frame = /** @type {Frame} */ (
                    page.frame({ url: "https://challenges.cloudflare.com/**" })
                );
                await frame.locator('input[type="checkbox"]').check();

                const success = await frame.locator("#success");
                await success.waitFor({ state: "visible" });
            } finally {
                await page.screenshot({
                    path: "./log/bing-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/bing-cr.html", await page.content());

                await context.close();
                await browser.close();
            }
        });
    });
});
