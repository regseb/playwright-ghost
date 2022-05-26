import assert from "node:assert";
import fs from "node:fs/promises";
import { firefox } from "../../src/index.js";

describe("Cloudflare", function () {
    it("should be redirect", async function () {
        const browser = await firefox.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        try {
            page.on("console", (msg) => console.log(msg));
            page.on("pageerror", (err) => console.log(err));
            await page.goto("https://www.extreme-down.io/");
            await page.waitForTimeout(8000);
            const title = await page.title();
            assert.ok(title.startsWith("Extreme Down"),
                      `"${title}".startsWith(...)`);
        } catch (err) {
            await page.screenshot({
                path:     "./log/cloudflare-fx.png",
                fullPage: true,
            });
            await fs.writeFile("./log/cloudflare-fx.html",
                               await page.content());

            throw err;
        } finally {
            await browser.close();
        }
    });
});
