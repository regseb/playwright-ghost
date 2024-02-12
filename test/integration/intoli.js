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

// """
//  Les sites web justifient leur identité par des certificats qui ont une
//  période de validité définie. Le certificat de intoli.com a expiré le
//  12/11/2023.
// """
describe.skip("Chrome Headless Detection (Intoli)", function () {
    describe("chromium", function () {
        it("should not failed", async function () {
            const browser = await chromium.launch({
                plugins: [
                    ...plugins.recommendedPlugins(),
                    plugins.polyfill.userAgentPlugin({
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
            } catch (err) {
                await page.screenshot({
                    path: "./log/intoli-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/intoli-cr.html",
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
