/**
 * @module
 */

import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

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

export default class InitScriptPlugin {

    async getContent(browserContext) {
        const script = await this.getScript(browserContext);

        if (undefined === script) {
            return "";
        }
        if (script instanceof Function) {
            return `(${script.toString()})();`;
        }
        if ("path" in script) {
            return fs.readFile(script.path);
        }
        if ("content" in script) {
            return script.content;
        }
    }

    static merge(plugins) {
        return async (browserContextPromise) => {
            const browserContext = await browserContextPromise;
            let initScript = "";
            for (const plugin of plugins) {
                if (plugin instanceof InitScriptPlugin) {
                    initScript += `{
                        ${await plugin.getContent(browserContext)}
                    }`;
                }
            }
            if (0 !== initScript.length) {
                const ghost = await fs.readFile(
                    await import.meta.resolve("./script/ghost.injected.js"),
                    { encoding: "utf8" },
                );

                browserContext.addInitScript({
                    content: `
                        try {
                            ${ghost}
                            ${initScript}
                        } catch (err) {
                            console.log(err);
                        }`,
                });
            }
            return browserContext;
        };
    }
}
