import assert from "node:assert";
import fs from "node:fs/promises";
import { firefox } from "../../src/index.js";

describe("Datadome", function () {
    describe("firefox", function () {
        it("should not lose your head", async function () {
            const browser = await vanilla.chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                page.on("console", (msg) => console.log(msg));
                page.on("pageerror", (err) => console.log(err));
                await page.goto("https://antoinevastel.com/bots/datadome");
                await page.waitForTimeout(5000);

                console.log(page.url());
                assert.fail();
            } catch (err) {
                await page.screenshot({
                    path:     "./log/datadome-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/datadome-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
