import assert from "node:assert";
import fs from "node:fs/promises";
import { chromium, firefox, vanilla } from "../../src/index.js";

describe("CreepJS", function () {
    describe("chromium", function () {
        it.skip("should get an A grade", async function () {
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
        it("should get an A grade", async function () {
            const browser = await vanilla.firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://abrahamjuliot.github.io/creepjs/");
                await page.waitForTimeout(5000);

                const scrap = (name) => {
                    const div = document.querySelector(`.${name}:not(.hash)`);
                    if (null === div) {
                        return { name, count: 0, errors: [] };
                    }
                    const text = div.textContent;
                    return {
                        name,
                        count: Number.parseInt(
                            text.substring(text.indexOf("(") + 1,
                                           text.indexOf(")")),
                            10,
                        ),
                        errors:
                            Array.from(div.querySelectorAll("label > div > div"))
                                 .map((d) =>
                                    d.textContent.trim()
                                                 .replaceAll(/[\n\t]+/gu, " ")),
                    };
                };

                for (const name of ["lies", "errors"]) {
                    const results = await page.evaluate(scrap, name);
                    assert.strictEqual(
                        results.count,
                        0,
                        `${results.name}:\n${results.errors.join("\n")}`,
                    );
                }
                assert.ok(false);
            } catch (err) {
                await fs.writeFile("./log/creepjs-fx.html",
                                   await page.content());
                await page.screenshot({
                    path:     "./log/creepjs-fx.png",
                    fullPage: true,
                });

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
