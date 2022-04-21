import fs from "node:fs/promises";
import { firefox } from "../../src/index.js";

describe("HyipStats", function () {
    it("should pass captcha", async function () {
        const browser = await firefox.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://hyipstats.net/fr/open_link" +
                                    "/NVNQeWtvWlI5MlJQWlA4OUVLNEc1S3pJZEdRU3B" +
                                    "OQWE0Skxka05YOGdyUEwrcElwakQrRXpVRUE2aTR" +
                                     "DTnI0bDhxMHI4VHJOR2VrVVBTemVkN1dPYVE9PQ");
        const captcha = await page.$("#captcha .geetest_radar_tip_content");
        // Simuler le déplacement la souris sur le captcha pour l'activer.
        await captcha.hover();
        await captcha.click();
        // Attendre que le captcha soit validé.
        await page.waitForSelector(".geetest_radar_success");
        // Laisser la faute d'orthographe ("sumbit" / "submit") dans
        // l'identifiant car la faute est présente dans la page.
        await page.click("#sumbit_btn");
        const href = await page.getAttribute(".alert h3 a", "href");
        if (null === href) {
            console.log("Erreur");
            await fs.writeFile("hyipstats.html", await page.content());
        }
        await browser.close();
    });
});
