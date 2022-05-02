import assert from "node:assert";
import fs from "node:fs/promises";
import { firefox } from "../../src/index.js";

describe("infosimples", function () {
    describe("firefox", function () {
        it("should not failed", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://infosimples.github.io" +
                                                           "/detect-headless/");
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#mouse-move-result:not(:empty)");

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("tr"))
                                .slice(1) // Enlever les entêtes.
                                .map((tr) => ({
                        name:   tr.querySelector("td:first-child").textContent,
                        value:  tr.querySelector("td:last-child").textContent,
                        status: tr.className,
                    }));
                });

                for (const result of results) {
                    assert.ok(
                        "headful" === result.status ||
                            "undefined" === result.status,
                        `${result.name} (${result.status}): ${result.value}`,
                    );
                }
            } catch (err) {
                await fs.writeFile("./log/infosimples-fx.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/infosimples-fx.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
