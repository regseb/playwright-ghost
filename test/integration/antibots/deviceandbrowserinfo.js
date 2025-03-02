/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
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

describe("Anti-bot: Deviceandbrowserinfo", function () {
    describe("chromium", function () {
        it("should be human", async function () {
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
                await page.goto(
                    "https://deviceandbrowserinfo.com/are_you_a_bot",
                );
                // Fermer le popup cookies, car elle cache les résultats dans la
                // capture d'écran.
                await page.locator("#declineCookies").click();
                await page.waitForTimeout(5000);
                const result = /** @type {string} */ (
                    await page.locator("#resultsBotTest").textContent()
                );
                if ("You are human!" !== result) {
                    assert.fail(result);
                }
            } finally {
                await page.screenshot({
                    path: "./log/deviceandbrowserinfo-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/deviceandbrowserinfo-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
