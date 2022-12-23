import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("Cloudfalre", function () {
    describe("chromium", function () {
        it("should be success with managed challenge", async function () {
            const browser = await chromium.launch({
                headless: false,
                plugins:  {
                    "util/debug": false,
                },
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://peet.ws/turnstile-test/managed.html");
                await page.waitForTimeout(5000);

                const CHALLENGES_HOST = "https://challenges.cloudflare.com/";
                for (const frame of page.mainFrame().childFrames()) {
                    if (!frame.url().startsWith(CHALLENGES_HOST)) {
                        continue;
                    }
                    assert.ok(await frame.getByText("Success!").isVisible());
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/cloudflare_managed-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/cloudflare_managed-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
        it("should be success with non-interactive challenge",
                                                             async function () {
            const browser = await chromium.launch({
                headless: false,
                plugins:  {
                    "util/debug": false,
                },
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://peet.ws/turnstile-test" +
                                "/non-interactive.html");
                await page.waitForTimeout(5000);

                const CHALLENGES_HOST = "https://challenges.cloudflare.com/";
                for (const frame of page.mainFrame().childFrames()) {
                    if (!frame.url().startsWith(CHALLENGES_HOST)) {
                        continue;
                    }
                    assert.ok(await frame.getByText("Success!").isVisible());
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/cloudflare_noninteractive-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/cloudflare_noninteractive-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should be success with non-interactive challenge",
                                                             async function () {
            const browser = await firefox.launch({
                headless: false,
                plugins:  {
                    "util/debug": false,
                },
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://peet.ws/turnstile-test" +
                                "/non-interactive.html");
                await page.waitForTimeout(5000);

                const CHALLENGES_HOST = "https://challenges.cloudflare.com/";
                for (const frame of page.mainFrame().childFrames()) {
                    if (!frame.url().startsWith(CHALLENGES_HOST)) {
                        continue;
                    }
                    assert.ok(await frame.getByText("Success!").isVisible());
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/cloudflare_noninteractive-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/cloudflare_noninteractive-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
