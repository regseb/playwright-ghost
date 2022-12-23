import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

/* global document */

describe("infosimples", function () {
    describe("chromium", function () {
        it("should not be detected on headless", async function () {
            const browser = await chromium.launch({ headless: true });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://infosimples.github.io" +
                                "/detect-headless/");
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#mouse-move-result:not(:empty)");

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("tr"))
                                // Enlever les entêtes.
                                .slice(1)
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
                await page.screenshot({
                    path:     "./log/infosimples-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/infosimples-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not be detected on headless", async function () {
            const browser = await firefox.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://infosimples.github.io" +
                                "/detect-headless/");
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#mouse-move-result:not(:empty)");

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("tr"))
                                // Enlever les entêtes.
                                .slice(1)
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
                await page.screenshot({
                    path:     "./log/infosimples-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/infosimples-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
