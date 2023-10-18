/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import playwright from "playwright";
import { chromium } from "../../src/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        args: ["--headless=new"],
        executablePath: "/snap/bin/chromium",
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Guillotine", function () {
    describe("chromium", function () {
        it("should not lose your head in headless", async function () {
            const browser = await chromium.launch({
                executablePath: "/snap/bin/chromium",
                plugins: {
                    "polyfill/userAgent": { userAgent: await getUserAgent() },
                    "util/debug": true,
                },
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("http://localhost:1789/?level=warn");
                // Attendre tous les résultats.
                await page.waitForSelector("tbody:not(.running)", {
                    state: "attached",
                });

                const results = await page.locator("tr").evaluateAll((trs) => {
                    // Enlever les entêtes.
                    return trs.slice(1).map((tr) => ({
                        code: tr.querySelector("td.code").textContent,
                        actual: tr.querySelector("td.actual").textContent,
                        expected: tr.querySelector("td.expected")?.textContent,
                        status: tr.classList.contains("passed"),
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
                    path: "./log/guillotine-cr_headless.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/guillotine-cr_headless.html",
                    await page.content(),
                );

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });

        it("should not lose your head in headfull", async function () {
            const browser = await chromium.launch({
                headless: false,
                executablePath: "/snap/bin/chromium",
                plugins: { "util/debug": true },
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("http://localhost:1789/?level=warn");
                // Attendre tous les résultats.
                await page.waitForSelector("tbody:not(.running)", {
                    state: "attached",
                });

                const results = await page.locator("tr").evaluateAll((trs) => {
                    // Enlever les entêtes.
                    return trs.slice(1).map((tr) => ({
                        code: tr.querySelector("td.code").textContent,
                        actual: tr.querySelector("td.actual").textContent,
                        expected: tr.querySelector("td.expected")?.textContent,
                        status: tr.classList.contains("passed"),
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
                    path: "./log/guillotine-cr_headfull.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/guillotine-cr_headfull.html",
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
