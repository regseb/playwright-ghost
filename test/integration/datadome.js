import assert from "node:assert";
import fs from "node:fs/promises";
import { firefox, vanilla } from "../../src/index.js";

describe("Datadome", function () {
    describe("firefox", function () {
        it("should not lose your head", async function () {
            const browser = await vanilla.firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                page.on("console", (msg) => console.log(msg));
                page.on("pageerror", (err) => console.log(err));
                await page.goto("https://antoinevastel.com/bots/datadome");
                // Attendre toutes les résultats.
                //await page.waitForSelector("tbody:not(.running)");
                await page.waitForTimeout(5000);
                assert.fail();

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("tr"))
                                .slice(1) // Enlever les entêtes.
                                .map((tr) => ({
                        code:     tr.querySelector("td.code").textContent,
                        actual:   tr.querySelector("td.actual").textContent,
                        expected: tr.querySelector("td.expected")?.textContent,
                        status:   tr.classList.contains("passed"),
                    }));
                });

                for (const result of results) {
                    assert.ok(
                        result.status,
                        `${result.code} (${result.expected}): ${result.actual}`,
                    );
                }
            } catch (err) {
                await fs.writeFile("./log/datadome-fx.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/datadome-fx.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
