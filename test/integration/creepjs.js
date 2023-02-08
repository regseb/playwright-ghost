import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "../../src/index.js";

describe("CreepJS", function () {
    describe("chromium", function () {
        it("should get a B (or A) grade", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext({
                // Utiliser le thème sombre car CreepJS considère que le thème
                // claire est probablement défini par un navigateur headless.
                colorScheme: "dark",
            });
            const page = await context.newPage();
            try {
                await page.goto("https://abrahamjuliot.github.io/creepjs/");
                await page.waitForTimeout(5000);
                const grade = await page.getByText("trust score")
                                        .locator(`span[class^="scale-"]`)
                                        .textContent();
                if (!grade.startsWith("A") && !grade.startsWith("B")) {
                    assert.fail(grade);
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/creepjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/creepjs-cr.html",
                                   await page.content());
                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
