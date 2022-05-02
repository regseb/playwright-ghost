import { fileURLToPath } from "node:url";
import { firefox } from "../../../../src/index.js";

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

describe("plugin/meta/script/ghost.injected.js", function () {
    describe("firefox", function () {
        describe("proxify", function () {
            it("should proxy object", async function () {
                const browser = await firefox.launch({
                    plugins: { "*": false },
                });
                const context = await browser.newContext();
                context.addInitScript({
                    path: await import.meta.resolve("../../../../src/plugin" +
                                                                "/meta/script" +
                                                          "/ghost.injected.js"),
                });

                const page = await context.newPage();
                try {
                    const results = await page.evaluate(() => {
                        return Ghost;
                    });

                    console.log(results);
                } finally {
                    await browser.close();
                }
            });
        });
    });
});
