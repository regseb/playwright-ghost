import assert from "node:assert";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, firefox } from "../../src/index.js";
import which from "../../src/which.js";

if (undefined === import.meta.resolve) {

    /**
     * Résous un chemin relatif à partir du module.
     *
     * @param {string} specifier Le chemin relatif vers un fichier ou un
     *                           répertoire.
     * @returns {Promise<string>} Une promesse contenant le chemin absolue vers
     *                            le fichier ou le répertoire.
     * @see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
     */
    import.meta.resolve = (specifier) => {
        return Promise.resolve(fileURLToPath(new URL(specifier,
                                                     import.meta.url).href));
    };
}

describe("fingerprint", function () {
    describe("chromium", function () {
        it("should open file", async function () {
            const browser = await chromium.launch({
                executablePath: await which("chromium"),
                headless: false,
            });
                const context = await browser.newContext();
                const page = await context.newPage();
                page.goto("file:///home/regseb/dev/playwright-ghost/test/data/index.html");
        });

        it.skip("should not spoofed", async function () {
            const browser = await chromium.launch({
                executablePath: await which("chromium"),
            });
            try {
                const context = await browser.newContext();
                const page = await context.newPage();

                const ghost = await page.evaluate(await fs.readFile(
                    await import.meta.resolve("../tool/fingerprint.js"),
                    { encoding: "utf8" },
                ));

                const { default: vanilla } = await import("../data/chromium.js");

console.log(ghost);
console.log("===================================================");
console.log(vanilla);
                assert.deepStrictEqual(
                    ghost.navigator.
                        prototypeOwnPropertyDescriptor,
                    vanilla.navigator.
                        prototypeOwnPropertyDescriptor,
                );
                assert.deepStrictEqual(ghost, vanilla);
            } finally {
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not spoofed", async function () {
            console.log(await which("firefox"));
            const browser = await firefox.launch({
                executablePath: await which("firefox-esr"),
            });
            try {
                const context = await browser.newContext();
                const page = await context.newPage();

                const ghost = await page.evaluate(await fs.readFile(
                    await import.meta.resolve("../tool/fingerprint.js"),
                    { encoding: "utf8" },
                ));

                const vanilla = JSON.parse(await fs.readFile(
                    await import.meta.resolve("../data/firefox.json"),
                    { encoding: "utf8" },
                ));

                assert.deepStrictEqual(ghost, vanilla);
            } finally {
                await browser.close();
            }
        });
    });
});
