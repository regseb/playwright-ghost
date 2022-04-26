import fs from "node:fs/promises";
import firefox from "playwright";

describe("FIXME Tester des trucs", function () {
    describe("firefox", function () {
        it("FIXME Tester des trucs", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                const result = await page.evaluate(() => {
                    return Object.getOwnPropertyDescriptor(Plugin.prototype, "version");
                });
                console.log(result);
            } finally {
                await browser.close();
            }
        });
    });
});
