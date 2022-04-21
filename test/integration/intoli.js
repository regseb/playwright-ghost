import assert from "node:assert";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("Chrome Headless Detection (Round II)", function () {
    describe("chromium", function () {
        it("should not failed", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://intoli.com/blog/not-possible-to" +
                                                      "-block-chrome-headless" +
                                                  "/chrome-headless-test.html");
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#languages-result:not(:empty)");

                const tds = await page.$$("td.failed");
                assert.strictEqual(tds.length, 0);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/intoli-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/intoli-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not failed", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://intoli.com/blog/not-possible-to" +
                                                      "-block-chrome-headless" +
                                                  "/chrome-headless-test.html");
                // Attendre le résultat du dernier test.
                await page.waitForSelector("#languages-result:not(:empty)");

                // Ignorer le test "chrome" qui il y a un faux-positif sous
                // Firefox.
                const tds = await page.$$("td.failed:not(#chrome-result)");
                assert.strictEqual(tds.length, 0);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/intoli-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/intoli-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
