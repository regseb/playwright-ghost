/**
 * @license MIT
 * @see https://www.browserscan.net/bot-detection
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

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

describe("Anti-bot: BrowserScan", () => {
    describe("chromium", () => {
        it("should pass", async () => {
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
                await page.goto("https://www.browserscan.net/bot-detection");
                await page.waitForTimeout(5000);
                const result = await page
                    .getByText("Test Results:", { exact: true })
                    .evaluate(
                        (element) =>
                            element.parentElement?.querySelector(
                                "strong:last-child",
                            )?.textContent,
                    );
                assert.equal(result, "Normal");
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
