import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("CreepJS", function () {
    describe("chromium", function () {
        it("should not get F-", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://abrahamjuliot.github.io/creepjs/");
                await page.waitForTimeout(5000);
                await page.screenshot({
                    path:     "./log/creepjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/creepjs-cr.html",
                                   await page.content());
            } finally {
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not get F-", async function () {
            const browser = await firefox.launch({headless: false});
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://abrahamjuliot.github.io/creepjs/");
                await page.waitForTimeout(5000);
                await page.screenshot({
                    path:     "./log/creepjs-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/creepjs-fx.html",
                                   await page.content());
            } finally {
          //      await browser.close();
            }
        });
    });
});
