import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("Perdu sur l'Internet ?", function () {
    describe("chromium", function () {
        it("should open a simple page", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://perdu.com/");
                await page.waitForTimeout(1000);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/perdu-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/perdu-cr.html", await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should open a simple page", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://perdu.com/");
                await page.waitForTimeout(1000);
            } catch (err) {
                await page.screenshot({
                    path:     "./log/perdu-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/perdu-fx.html", await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
