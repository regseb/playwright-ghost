import assert from "node:assert";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

describe("HyipStats", function () {
    describe("chromium", function () {
        it("should pass captcha", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://hyipstats.net/fr/open_link" +
                                    "/NVNQeWtvWlI5MlJQWlA4OUVLNEc1S3pJZEdRU3B" +
                                    "OQWE0Skxka05YOGdyUEwrcElwakQrRXpVRUE2aTR" +
                                     "DTnI0bDhxMHI4VHJOR2VrVVBTemVkN1dPYVE9PQ");
                // Ne pas utiliser seulement l'identifiant #captcha car le
                // captcha est chargé dynamiquement dans un sous élément.
                const captcha = await page.waitForSelector(
                    "#captcha .geetest_radar_tip_content",
                );
                // Simuler le déplacement la souris sur le captcha pour
                // l'activer.
                await captcha.hover();
                await captcha.click();
                // Attendre que le captcha soit validé.
                await page.waitForSelector(".geetest_radar_success");
                // Laisser la faute d'orthographe ("sumbit" / "submit") dans
                // l'identifiant car la faute est présente dans la page.
                await page.click("#sumbit_btn");

                const href = await page.getAttribute(".alert h3 a", "href");
                assert.strictEqual(href, "https://uptobox.com/wl6zfiruo63q" +
                                                             "?aff_id=4521439");
            } catch (err) {
                await page.screenshot({
                    path:     "./log/hyipstats-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/hyipstats-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should pass captcha", async function () {
            const browser = await firefox.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://hyipstats.net/fr/open_link" +
                                    "/NVNQeWtvWlI5MlJQWlA4OUVLNEc1S3pJZEdRU3B" +
                                    "OQWE0Skxka05YOGdyUEwrcElwakQrRXpVRUE2aTR" +
                                     "DTnI0bDhxMHI4VHJOR2VrVVBTemVkN1dPYVE9PQ");
                // Ne pas utiliser seulement l'identifiant #captcha car le
                // captcha est chargé dynamiquement dans un sous élément.
                const captcha = await page.waitForSelector(
                    "#captcha .geetest_radar_tip_content",
                );
                // Simuler le déplacement la souris sur le captcha pour
                // l'activer.
                await captcha.hover();
                await captcha.click();
                // Attendre que le captcha soit validé.
                await page.waitForSelector(".geetest_radar_success");
                // Laisser la faute d'orthographe ("sumbit" / "submit") dans
                // l'identifiant car la faute est présente dans la page.
                await page.click("#sumbit_btn");

                const href = await page.getAttribute(".alert h3 a", "href");
                assert.strictEqual(href, "https://uptobox.com/wl6zfiruo63q" +
                                                             "?aff_id=4521439");
            } catch (err) {
                await page.screenshot({
                    path:     "./log/hyipstats-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/hyipstats-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await browser.close();
            }
        });
    });
});
