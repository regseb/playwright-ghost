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

describe("infosimples", function () {
    describe("chromium", function () {
        it("should not be detected on headless", async function () {
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
                    "https://infosimples.github.io/detect-headless/",
                );
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#mouse-move-result:not(:empty)");
                // Bouger la souris pour un des tests.
                for (let i = 0; 100 > i; ++i) {
                    await page.mouse.move(10 * i, 10 * i);
                }

                const results = await page.locator("tr").evaluateAll((trs) => {
                    // Enlever les entêtes.
                    return trs.slice(1).map((tr) => ({
                        name: tr.querySelector("td:first-child").textContent,
                        value: tr.querySelector("td:last-child").textContent,
                        status: tr.className,
                    }));
                });

                for (const result of results) {
                    // Ignorer le test Broken Image qui échoue même avec un vrai
                    // navigateur.
                    if ("Broken Image" === result.name) {
                        continue;
                    }
                    assert.equal(
                        result.status,
                        "headful",
                        `${result.name}: ${result.value}`,
                    );
                }
            } catch (err) {
                await page.screenshot({
                    path: "./log/infosimples-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/infosimples-cr.html",
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
