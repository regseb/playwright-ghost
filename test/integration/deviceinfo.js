import assert from "node:assert";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("Device Info", function () {
    describe("chromium", function () {
        it("should not spoofed", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.deviceinfo.me/");
                await page.waitForTimeout(5000);

                const span = await page.$(`span:text-is("(Spoofed)")`);
                // eslint-disable-next-line unicorn/no-null
                assert.strictEqual(span, null);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/deviceinfo-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/deviceinfo-cr.html",
                                   await page.content());

                throw err;
            } finally {
               await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not spoofed", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://www.deviceinfo.me/");
                await page.waitForTimeout(5000);

                const span = await page.$(`span:text-is("(Spoofed)")`);
                // eslint-disable-next-line unicorn/no-null
                assert.strictEqual(span, null);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/deviceinfo-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/deviceinfo-fx.html",
                                   await page.content());

                throw err;
            } finally {
               await browser.close();
            }
        });
    });
});
