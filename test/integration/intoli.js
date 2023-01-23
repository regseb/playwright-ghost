import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

/* global document */

describe("Chrome Headless Detection (Intoli)", function () {
    describe("chromium", function () {
        it("should not failed", async function () {
            const browser = await chromium.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://intoli.com/blog/not-possible-to" +
                                "-block-chrome-headless" +
                                "/chrome-headless-test.html");
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#languages-result:not(:empty)");

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("td.result"),
                                      (td) => ({
                        name:   td.previousElementSibling.textContent,
                        value:  td.textContent,
                        status: td.classList.contains("passed"),
                    }));
                });

                for (const result of results) {
                    assert.ok(result.status, `${result.name}: ${result.value}`);
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/intoli-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/intoli-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not failed", async function () {
            const browser = await firefox.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://intoli.com/blog/not-possible-to" +
                                "-block-chrome-headless" +
                                "/chrome-headless-test.html");
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#languages-result:not(:empty)");

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("td.result"),
                                      (td) => ({
                        name:   td.previousElementSibling.textContent,
                        value:  td.textContent,
                        status: td.classList.contains("passed"),
                    }));
                });

                for (const result of results) {
                    // Ignorer le test "Chrome" qui remonte un faux-positif sous
                    // Firefox.
                    if ("Chrome (New)" === result.name) {
                        continue;
                    }
                    assert.ok(result.status, `${result.name}: ${result.value}`);
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/intoli-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/intoli-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
