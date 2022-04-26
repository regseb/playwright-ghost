import assert from "node:assert";
import fs from "node:fs/promises";
import { firefox } from "../../src/index.js";

describe("FingerprintJS", function () {
    describe("firefox", function () {
        it("should not be detected", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://fingerprintjs.com/products" +
                                "/bot-detection/");
                await page.waitForTimeout(5000);

                const results = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll(
                                    `div[class^="HeroSection-module--card--"]`))
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
                await fs.writeFile("./log/fingerprintjs-fx.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/fingerprintjs-fx.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
