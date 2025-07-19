/**
 * @license MIT
 * @see https://bot.sannysoft.com/
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        plugins: plugins.recommended(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Antibot (Sannysoft)", () => {
    describe("chromium", () => {
        it("should not failed", async () => {
            const browser = await playwright.chromium.launch({
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
                await page.goto("https://bot.sannysoft.com/");
                // Attendre le résultat du dernier test.
                await page.waitForSelector(
                    "#broken-image-dimensions:not(:empty)",
                );

                const results = await page
                    .locator("table:first-of-type tr")
                    .evaluateAll((trs) => {
                        // Enlever les entêtes.
                        return trs.slice(1).map((tr) => ({
                            name: tr.querySelector("td:first-child")
                                ?.textContent,
                            value: tr.querySelector("td:last-child")
                                ?.textContent,
                            status: Array.from(
                                tr.querySelector("td:last-child").classList,
                            ).find((c) => "result" !== c),
                        }));
                    });

                for (const result of results) {
                    assert.equal(
                        result.status,
                        "passed",
                        `${result.name}: ${result.value}`,
                    );
                }
            } finally {
                await page.screenshot({
                    path: "./log/sannysoft-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/sannysoft-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", () => {
        it("should not failed", async () => {
            const browser = await playwright.firefox.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.utils.camoufox({ headless: true }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://bot.sannysoft.com/");
                // Attendre le résultat du dernier test.
                await page.waitForSelector(
                    "#broken-image-dimensions:not(:empty)",
                );

                const results = await page
                    .locator("table:first-of-type tr")
                    .evaluateAll((trs) => {
                        // Enlever les entêtes.
                        return trs.slice(1).map((tr) => ({
                            name: tr.querySelector("td:first-child")
                                ?.textContent,
                            value: tr.querySelector("td:last-child")
                                ?.textContent,
                            status: Array.from(
                                tr.querySelector("td:last-child").classList,
                            ).find((c) => "result" !== c),
                        }));
                    });

                for (const result of results) {
                    // Ignorer le test Chrome (New), car la variable chrome
                    // n'existe pas dans Firefox.
                    if ("Chrome (New)" === result.name) {
                        continue;
                    }
                    assert.equal(
                        result.status,
                        "passed",
                        `${result.name}: ${result.value}`,
                    );
                }
            } finally {
                await page.screenshot({
                    path: "./log/sannysoft-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/sannysoft-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
