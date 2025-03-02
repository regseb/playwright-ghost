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

describe("Anti-bot: BrowserScan", function () {
    describe("chromium", function () {
        it("should pass", async function () {
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
                await page.goto("https://www.browserscan.net/bot-detection");
                await page.waitForTimeout(5000);
                const result = await page
                    .getByText("Test Results:", { exact: true })
                    .evaluate(
                        (element) =>
                            element.parentElement.querySelector(
                                "strong:last-child",
                            ).textContent,
                    );
                if ("Normal" !== result) {
                    assert.fail(result);
                }
            } finally {
                await page.screenshot({
                    path: "./log/browserscan-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/browserscan-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
