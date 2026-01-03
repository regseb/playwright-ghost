/**
 * @license MIT
 * @see https://github.com/LouisKlimek/HeadlessDetectJS
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        plugins: plugins.recommended(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: HeadlessDetectJS", () => {
    describe("chromium", () => {
        it("should get 0 score", async () => {
            const browser = await playwright.chromium.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://example.com/");

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

    describe("firefox", () => {
        it("should get 0 score", async () => {
            const browser = await playwright.firefox.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.utils.camoufox({ headless: true }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://example.com/");

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
