import assert from "node:assert";
import fs from "node:fs/promises";
//import fetch from "node-fetch";
import { firefox } from "../../src/index.js";

describe("HeadlessDetectJS", function () {
    describe("firefox", function () {
        it("should get 0 score", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();

            const response = await fetch("https://raw.githubusercontent.com" +
                                               "/LouisKlimek/HeadlessDetectJS" +
                                                     "/main/headlessDetect.js");
            const content = await response.text();
            context.addInitScript({ content });

            const page = await context.newPage();
            try {
                page.on("console", (msg) => console.log(msg));
                page.on("pageerror", (err) => console.log(err));
                await page.goto("https://perdu.com/");

                const score = await page.evaluate(() => {
                    const headlessDetector = new HeadlessDetect();
                    return headlessDetector.getHeadlessScore();
                });

                assert.strictEqual(score, 0);
            } catch (err) {
                await fs.writeFile("./log/headlessdetectjs-fx.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/headlessdetectjs-fx.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
