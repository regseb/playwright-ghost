/**
 * @module
 */

import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Plugin from "./plugin.js";

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

const getInitContent = async function (initScript) {
    const args = JSON.stringify(initScript.args);
    if ("func" in initScript) {
        return `(${initScript.func.toString()})(${args});`;
    }
    if ("path" in initScript) {
        const content = await fs.readFile(initScript.path);
        return `((importMeta) => {
            ${content}
        })({ arguments: ${args} });`;
    }
    if ("content" in initScript) {
        return `((importMeta) => {
            ${initScript.content}
        })({ arguments: ${args} });`;
    }
    throw new Error("Invalid value returned by addInitScript");
};

export default class InitScriptPlugin extends Plugin {
    static name = "meta/initScript";

    #plugins;

    constructor(plugins) {
        super();
        this.addListener("Browser.newContext:after",
                         this.#addAllInitScript.bind(this));
        this.#plugins = plugins;
    }

    async #addAllInitScript(context) {
        const initScripts = [];
        for (const plugin of this.#plugins) {
            const initScript = await plugin.addInitScript(context);
            if (undefined !== initScript) {
                initScripts.push(await getInitContent(initScript));
            }
        }
        if (0 !== initScripts.length) {
            const native = await fs.readFile(
                await import.meta.resolve("./native.injected.js"),
                { encoding: "utf8" },
            );

            const ghost = await fs.readFile(
                await import.meta.resolve("./ghost.injected.js"),
                { encoding: "utf8" },
            );

            context.addInitScript({
                content: `{
                    ${native}
                    ${ghost}
                    ${initScripts.join("\n")}
                }`,
            });
        }
        return context;
    }
}
