/**
 * @license MIT
 * @see https://bot-detector.rebrowser.net/
 * @see https://github.com/rebrowser/rebrowser-bot-detector
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import process from "node:process";
import { describe, it } from "node:test";
import plugins from "../../../src/plugins/index.js";
import rebrowser from "../../../src/rebrowser.js";

const getUserAgent = async () => {
    const browser = await rebrowser.chromium.launch({
        plugins: plugins.recommended(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: rebrowser-bot-detector", () => {
    describe("chromium", () => {
        it("should not be detected", async () => {
            const browser = await rebrowser.chromium.launch({
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
                // Contourner l'isolation des scripts.
                // https://rebrowser.net/blog/how-to-access-main-context-objects-from-isolated-context-in-puppeteer-and-playwright-23741
                await page.addInitScript(() => {
                    globalThis.addEventListener("message", (event) => {
                        if ("call" === event.data) {
                            globalThis.dummyFn();
                            // eslint-disable-next-line no-undef, unicorn/prefer-query-selector
                            document.getElementById("detections-json");
                            // Ne pas exécuter la ligne suivante dans ce monde
                            // pour ne pas être détecté.
                            // document.getElementsByClassName("div");
                        }
                    });
                });

                await page.goto("https://bot-detector.rebrowser.net/");

                process.env.REBROWSER_PATCHES_RUNTIME_FIX_MODE =
                    "alwaysIsolated";
                await page.evaluate(() => {
                    globalThis.postMessage("call");
                    // Exécuter la ligne suivante dans ce monde qui est isolé.
                    // eslint-disable-next-line no-undef, unicorn/prefer-query-selector
                    document.getElementsByClassName("div");
                });

                // "You're using unpatched Playwright and method
                // `page.exposeFunction()`. No fix available."
                // await page.exposeFunction("exposedFn", () => {
                //     console.log("exposedFn call");
                // });

                const results = await page
                    .locator("#detections-json")
                    .inputValue();

                for (const result of JSON.parse(results)) {
                    // https://github.com/rebrowser/rebrowser-patches/issues/10#issuecomment-2397629630
                    if ("mainWorldExecution" === result.type) {
                        assert.equal(
                            result.rating,
                            0,
                            `${result.type}: ${result.note}`,
                        );
                    } else {
                        assert.equal(
                            result.rating,
                            -1,
                            `${result.type}: ${result.note}`,
                        );
                    }
                }
            } finally {
                await page.screenshot({
                    path: "./log/rebrowserbotdetector-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/rebrowserbotdetector-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
