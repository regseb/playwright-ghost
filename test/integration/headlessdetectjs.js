/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../src/index.js";
import rebrowser from "../../src/rebrowser.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({
        args: ["--headless=new"],
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("HeadlessDetectJS", function () {
    describe("chromium", function () {
        it("should get 0 score", async function () {
            const browser = await rebrowser.chromium.launch({
                plugins: [
                    ...rebrowser.plugins.recommended(),
                    rebrowser.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://perdu.com/");

                const response = await fetch(
                    "https://raw.githubusercontent.com/LouisKlimek" +
                        "/HeadlessDetectJS/main/headlessDetect.js",
                );
                const script = await response.text();
                await page.evaluate(
                    `${script}\nglobalThis.HeadlessDetect = HeadlessDetect;`,
                );

                const score = await page.evaluate(() => {
                    // eslint-disable-next-line no-undef
                    const headlessDetect = new HeadlessDetect();
                    return headlessDetect.getHeadlessScore();
                });

                assert.equal(score, 0);
            } finally {
                await page.screenshot({
                    path: "./log/headlessdetectjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/headlessdetectjs-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should get 0 score", async function () {
            const browser = await vanilla.firefox.launch({
                plugins: vanilla.plugins.recommended(),
            });
            const context = await browser.newContext();

            const response = await fetch(
                "https://raw.githubusercontent.com/LouisKlimek" +
                    "/HeadlessDetectJS/main/headlessDetect.js",
            );
            const script = await response.text();
            await context.addInitScript({
                content: `${script}\nglobalThis.HeadlessDetect = HeadlessDetect;`,
            });

            const page = await context.newPage();
            try {
                await page.goto("https://perdu.com/");

                const score = await page.evaluate(() => {
                    // eslint-disable-next-line no-undef
                    const headlessDetect = new HeadlessDetect();
                    return headlessDetect.getHeadlessScore();
                });

                assert.equal(score, 0);
            } finally {
                await page.screenshot({
                    path: "./log/headlessdetectjs-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/headlessdetectjs-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
