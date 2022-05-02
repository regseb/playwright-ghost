import assert from "node:assert";
import fs from "node:fs/promises";
import { firefox } from "../../src/index.js";

describe("Sannysoft", function () {
    describe("firefox", function () {
        it("should not failed", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://bot.sannysoft.com/");
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#broken-image-dimensions" +
                                                                ":not(:empty)");

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("td.result"))
                                .map((td) => ({
                        name:   td.previousElementSibling.textContent,
                        value:  td.textContent,
                        status: td.classList.contains("passed"),
                    }));
                });

                for (const result of results) {
                    // Ignorer les tests "Chrome" et "Hairline Feature" qui
                    // remontent des faux-positifs sous Firefox.
                    if ("Chrome (New)" === result.name ||
                            "Hairline Feature" === result.name) {
                        continue;
                    }
                    assert.ok(result.status, `${result.name}: ${result.value}`);
                }
            } catch (err) {
                await fs.writeFile("./log/sannysoft-fx.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/sannysoft-fx.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
