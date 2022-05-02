import assert from "node:assert";
import fs from "node:fs/promises";
import { chromium, firefox, vanilla } from "../../src/index.js";

describe("Guillotine", function () {
    describe("chromium", function () {
        it("should not lose your head", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                page.on("console", (msg) => console.log(msg));
                page.on("pageerror", (err) => console.log(err));
                await page.goto("http://127.0.0.1:8080/guillotine/" +
                                                  "?ref=chromium&passed=false");
                // Attendre toutes les résultats.
                await page.waitForSelector("tbody:not(.running)",
                                           { state: "attached" });

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
                await fs.writeFile("./log/guillotine-cr.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/guillotine-cr.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not lose your head", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                page.on("console", (msg) => console.log(msg));
                page.on("pageerror", (err) => console.log(err));
                await page.goto("http://127.0.0.1:8080/guillotine/" +
                                                   "?ref=firefox&passed=false");
                // Attendre toutes les résultats.
                await page.waitForSelector("tbody:not(.running)",
                                           { state: "attached" });

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
                console.log(err);
                await fs.writeFile("./log/guillotine-fx.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/guillotine-fx.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
