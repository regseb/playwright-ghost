import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("Guillotine", function () {
    describe("chromium", function () {
        it("should not lose your head", async function () {
            const browser = await chromium.launch({
                headless:       false,
                executablePath: "/snap/bin/chromium",
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("http://localhost:1789/?level=warn");
                // Attendre tous les résultats.
                await page.waitForSelector("tbody:not(.running)",
                                           { state: "attached" });

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("tr"))
                                // Enlever les entêtes.
                                .slice(1)
                                .map((tr) => ({
                        code:     tr.querySelector("td.code").textContent,
                        actual:   tr.querySelector("td.actual").textContent,
                        expected: tr.querySelector("td.expected")?.textContent,
                        status:   tr.classList.contains("passed"),
                    }));
                });

                for (const result of results) {
                    assert.equal(result.actual, result.expected, result.code);
                    // Vérifier aussi le statut dans le cas où les valeurs
                    // actuelles et espérées sont identiques, mais que
                    // Guillotine les considère différentes.
                    assert.ok(
                        result.status,
                        `${result.code} (${result.expected}): ${result.actual}`,
                    );
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/guillotine-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/guillotine-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not lose your head", async function () {
            const browser = await firefox.launch({
                headless: false,
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("http://localhost:1789/?level=warn");
                // Attendre tous les résultats.
                await page.waitForSelector("tbody:not(.running)",
                                           { state: "attached" });

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("tr"))
                                // Enlever les entêtes.
                                .slice(1)
                                .map((tr) => ({
                        code:     tr.querySelector("td.code").textContent,
                        actual:   tr.querySelector("td.actual").textContent,
                        expected: tr.querySelector("td.expected")?.textContent,
                        status:   tr.classList.contains("passed"),
                    }));
                });

                for (const result of results) {
                    assert.equal(result.actual, result.expected, result.code);
                    // Vérifier aussi le statut dans le cas où les valeurs
                    // actuelles et espérées sont identiques, mais que
                    // Guillotine les considère différentes.
                    assert.ok(
                        result.status,
                        `${result.code} (${result.expected}): ${result.actual}`,
                    );
                }
            } catch (err) {
                await fs.writeFile("./log/guillotine-fx.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/guillotine-fx.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
