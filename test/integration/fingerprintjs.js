import assert from "node:assert";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("FingerprintJS", function () {
    describe("chromium", function () {
        it("should not be detected", async function () {
            const browser = await chromium.launch({ plugins: { "*": false } });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://fingerprintjs.com/products" +
                                "/bot-detection/");

                // Attendre le résultat du dernier test.
                await page.waitForSelector(
                    `[class⁼".HeroSection-module--botType--"]` +
                    ` h3:has-text("Virtual Machine")`,
                );

                const results = await page.evaluate(() => {
                    const selector = `div[class^="HeroSection-module--card--"]`;
                    return Array.from(document.querySelectorAll(selector))
                                .map((div) => ({
                        name:   div.querySelector("h3").textContent,
                        status: div.querySelector("p").textContent,
                    }));
                });

                for (const result of results) {
                    assert.strictEqual(result.status,
                                       "Not detected",
                                       result.name);
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/fingerprintjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/fingerprintjs-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not be detected", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://fingerprintjs.com/products" +
                                "/bot-detection/");

                // Attendre le résultat du dernier test.
                await page.waitForSelector(
                                   `[class⁼".HeroSection-module--botType--"]` +
                                   ` h3:has-text("Virtual Machine")`);

                const results = await page.evaluate(() => {
                    const selector = `div[class^="HeroSection-module--card--"]`;
                    return Array.from(document.querySelectorAll(selector))
                                .map((div) => ({
                        name:   div.querySelector("h3").textContent,
                        status: div.querySelector("p").textContent,
                    }));
                });

                for (const result of results) {
                    assert.strictEqual(result.status,
                                       "Not detected",
                                       result.name);
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/fingerprintjs-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/fingerprintjs-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
