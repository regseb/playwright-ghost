/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../../src/index.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({ channel: "chromium" });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: CreepJS", function () {
    describe("chromium", function () {
        it("should get a B (or A) grade", async function () {
            const browser = await vanilla.chromium.launch({
                plugins: [
                    ...vanilla.plugins.recommended(),
                    vanilla.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext({
                // Utiliser le thème sombre, car CreepJS considère que le thème
                // clair est probablement utilisé par un navigateur headless.
                colorScheme: "dark",
            });
            const page = await context.newPage();
            try {
                await page.goto("https://abrahamjuliot.github.io/creepjs/");
                await page.waitForTimeout(5000);
                const grade = await page
                    .getByText("trust score")
                    .locator('span[class^="scale-"]')
                    .textContent();
                if (!grade.startsWith("A") && !grade.startsWith("B")) {
                    assert.fail(grade);
                }
            } finally {
                await page.screenshot({
                    path: "./log/creepjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/creepjs-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
