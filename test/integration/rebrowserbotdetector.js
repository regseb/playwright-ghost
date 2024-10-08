/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../src/index.js";
import rebrowser from "../../src/rebrowser.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({
        args: ["--headless=new"],
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("rebrowser-bot-detector", function () {
    describe("chromium", function () {
        it("should not be detected", async function () {
            const browser = await rebrowser.chromium.launch({
                plugins: [
                    ...rebrowser.plugins.recommendeds(),
                    rebrowser.plugins.polyfill.userAgent({
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
                            // eslint-disable-next-line unicorn/prefer-query-selector
                            document.getElementById("detections-json");
                            // Ne pas exécuter la ligne suivante dans ce monde
                            // pour ne pas être détecté.
                            // document.getElementsByClassName("div");
                        }
                    });
                });

                await page.goto("https://bot-detector.rebrowser.net/");

                await page.evaluate(() => {
                    globalThis.postMessage("call");
                    // Exécuter la ligne suivante dans ce monde qui est isolé.
                    // eslint-disable-next-line unicorn/prefer-query-selector
                    document.getElementsByClassName("div");
                });

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

    describe("firefox", function () {
        it("should not be detected", async function () {
            const browser = await vanilla.firefox.launch({
                plugins: vanilla.plugins.recommendeds(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://bot-detector.rebrowser.net/");

                await page.evaluate(() => {
                    globalThis.dummyFn();
                    // eslint-disable-next-line unicorn/prefer-query-selector
                    document.getElementById("detections-json");
                    // Ne pas exécuter la ligne suivante qui est détectée, mais
                    // il est possible d'utiliser la méthode locator() de
                    // Playwright.
                    // document.getElementsByClassName("div");
                });
                page.locator(".div");

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
                    path: "./log/rebrowserbotdetector-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/rebrowserbotdetector-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
