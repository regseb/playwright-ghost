import assert from "node:assert";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("Guillotine", function () {
    describe("chromium", function () {
        it("should not lose your head", async function () {
            const browser = await chromium.launch({
                executablePath: "/snap/bin/chromium",
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                page.on("console", (msg) => console.log(msg));
                page.on("pageerror", (err) => console.log(err));
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
                    assert.ok(
                        result.status,
                        `${result.code} (${result.expected}): ${result.actual}`,
                    );
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/guillotine-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/guillotine-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
