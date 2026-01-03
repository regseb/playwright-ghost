/**
 * @license MIT
 * @see https://bot-detector.rebrowser.net/
 * @see https://github.com/rebrowser/rebrowser-bot-detector
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

describe("Anti-bot: rebrowser-bot-detector", () => {
    describe("chromium", () => {
        it("should not be detected", async () => {
            const browser = await patchright.chromium.launch({
                // Utiliser Chrome, car le test n'accepte pas Chromium.
                channel: "chrome",
                plugins: plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                // https://rebrowser.net/blog/how-to-access-main-context-objects-from-isolated-context-in-puppeteer-and-playwright-23741
                await page.addInitScript(() => {
                    globalThis.addEventListener("message", (event) => {
                        if ("call" === event.data) {
                            // Ne pas exécuter la ligne suivante dans un
                            // evaluate(), car la pile d'erreur contiendrait
                            // UtilityScript.
                            // eslint-disable-next-line no-undef, unicorn/prefer-query-selector
                            document.getElementById("detections-json");
                        }
                    });
                });

                await page.goto("https://bot-detector.rebrowser.net/");

                await page.evaluate(
                    () => {
                        globalThis.dummyFn();
                    },
                    [],
                    false,
                );

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
                    if (
                        "mainWorldExecution" === result.type ||
                        "exposeFunctionLeak" === result.type
                    ) {
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
