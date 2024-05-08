/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import playwright from "playwright";
import { chromium, plugins } from "../../src/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        args: ["--headless=new"],
        executablePath: playwright.chromium.executablePath(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Antibot (Sannysoft)", function () {
    describe("chromium", function () {
        it("should not failed", async function () {
            const browser = await chromium.launch({
                plugins: [
                    ...plugins.recommendeds(),
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
                                .textContent,
                            value: tr.querySelector("td:last-child")
                                .textContent,
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
            } catch (err) {
                await page.screenshot({
                    path: "./log/sannysoft-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/sannysoft-cr.html",
                    await page.content(),
                );

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
