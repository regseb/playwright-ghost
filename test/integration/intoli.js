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

describe("Chrome Headless Detection (Intoli)", function () {
    describe("chromium", function () {
        it("should not failed", async function () {
            const browser = await rebrowser.chromium.launch({
                plugins: [
                    ...rebrowser.plugins.recommended(),
                    rebrowser.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://intoli.com/blog" +
                        "/not-possible-to-block-chrome-headless" +
                        "/chrome-headless-test.html",
                );
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#languages-result:not(:empty)");

                const results = await page.locator("tr").evaluateAll((trs) => {
                    // Enlever les entêtes.
                    return trs.slice(1).map((tr) => ({
                        name: tr.querySelector("td:first-child").textContent,
                        value: tr.querySelector("td:last-child").textContent,
                        status: Array.from(
                            tr.querySelector("td:last-child").classList,
                        ),
                    }));
                });

                for (const result of results) {
                    assert.ok(
                        result.status.includes("passed"),
                        `${result.name}: ${result.value}`,
                    );
                }
            } finally {
                await page.screenshot({
                    path: "./log/intoli-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/intoli-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not failed", async function () {
            const browser = await vanilla.firefox.launch({
                plugins: vanilla.plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://intoli.com/blog" +
                        "/not-possible-to-block-chrome-headless" +
                        "/chrome-headless-test.html",
                );
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#languages-result:not(:empty)");

                const results = await page.locator("tr").evaluateAll((trs) => {
                    // Enlever les entêtes.
                    return trs.slice(1).map((tr) => ({
                        name: tr.querySelector("td:first-child").textContent,
                        value: tr.querySelector("td:last-child").textContent,
                        status: Array.from(
                            tr.querySelector("td:last-child").classList,
                        ),
                    }));
                });

                for (const result of results) {
                    // Ignorer le test "Chrome" qui s'applique seulement au
                    // navigateur Chromium.
                    if ("Chrome (New)" === result.name) {
                        continue;
                    }
                    assert.ok(
                        result.status.includes("passed"),
                        `${result.name}: ${result.value}`,
                    );
                }
            } finally {
                await page.screenshot({
                    path: "./log/intoli-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/intoli-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
