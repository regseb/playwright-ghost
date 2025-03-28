/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../../src/index.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({ channel: "chromium" });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: infosimples", function () {
    describe("chromium", function () {
        it("should not be detected on headless", async function () {
            const browser = await vanilla.chromium.launch({
                plugins: [
                    ...vanilla.plugins.recommended(),
                    vanilla.plugins.polyfill.userAgent({
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
                await page.mouse.move(100, 100);
                for (let i = 0; 5 > i; ++i) {
                    await page.mouse.move(10 * i, 10 * i);
                }

                const results = await page.locator("tr").evaluateAll((trs) => {
                    // Enlever les entêtes.
                    return trs.slice(1).map((tr) => ({
                        name: tr.querySelector("td:first-child")?.textContent,
                        value: tr.querySelector("td:last-child")?.textContent,
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
            } finally {
                await page.screenshot({
                    path: "./log/infosimples-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/infosimples-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
