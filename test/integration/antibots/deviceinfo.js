/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../../src/index.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({ channel: "chromium" });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Device Info", function () {
    describe("chromium", function () {
        it("should not be spoofed", async function () {
            const browser = await vanilla.chromium.launch({
                plugins: [
                    ...vanilla.plugins.recommended(),
                    vanilla.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.deviceinfo.me/");
                await page.waitForTimeout(5000);

                const spoofed = await page.getByText("(Spoofed)").all();
                assert.deepEqual(spoofed, []);
            } finally {
                await page.screenshot({
                    path: "./log/deviceinfo-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/deviceinfo-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
