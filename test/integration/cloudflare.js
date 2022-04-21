import fs from "node:fs/promises";
import { firefox } from "../../src/index.js";

describe("Cloudflare", function () {
    it("should be redirect", async function () {
        const browser = await firefox.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

/*
        await page.goto("https://zone-telechargement.cam/");
        await page.waitForTimeout(8000);
        const title = await page.title();
        if (!title.startsWith("Zone-Telechargement.CAM")) {
            console.log("Erreur");
            await page.screenshot({ path: "cloudflare.png", fullPage: true });
            await fs.writeFile("cloudflare.html", await page.content());
        }
        */
        await browser.close();
    });
});
