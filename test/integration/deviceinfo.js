import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("Device Info", function () {
    describe("chromium", function () {
        it("should not spoofed", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();

            await page.goto("https://www.deviceinfo.me/");
            await page.waitForTimeout(5000);
            const span = await page.$(`span:text-is("(Spoofed)")`);
            if (null !== span) {
                console.log("Erreur");
                await page.screenshot({
                    path:     "deviceinfo.png",
                    fullPage: true,
                });
                await fs.writeFile("deviceinfo.html", await page.content());
            }
            await browser.close();
        });
    });

    describe("firefox", function () {
        it("should not spoofed", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();

            await page.goto("https://www.deviceinfo.me/");
            await page.waitForTimeout(5000);
            const span = await page.$(`span:text-is("(Spoofed)")`);
            if (null !== span) {
                console.log("Erreur");
                await page.screenshot({
                    path:     "deviceinfo.png",
                    fullPage: true,
                });
                await fs.writeFile("deviceinfo.html", await page.content());
            }
            await browser.close();
        });
    });
});
