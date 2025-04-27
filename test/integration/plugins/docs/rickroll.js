/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../../src/index.js";

/**
 * @import { BrowserType } from "playwright"
 * @import { ContextBefore } from "../../../../src/hook.js"
 */

/**
 * Ajoute l'option `--disable-volume-adjust-sound` dans Chromium.
 *
 * @param {Record<string, any>|undefined} options     Les options de création
 *                                                    d'un `Browser`.
 * @param {BrowserType}                   browserType Le type de navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
 */
const disableVolumeAdjustSound = (options, browserType) => {
    if ("chromium" === browserType.name()) {
        return {
            ...options,
            args: ["--disable-volume-adjust-sound", ...(options?.args ?? [])],
        };
    }
    return options;
};

/**
 * Crée un plugin pour rickroller.
 *
 * @param {Object} [options]       Les options du plugin.
 * @param {string} [options.video] L'identifiant d'une vidéo YouTube.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
const rickrollPlugin = (options) => {
    const video = options?.video ?? "dQw4w9WgXcQ";

    return {
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            return [disableVolumeAdjustSound(args[0], browserType)];
        },

        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType },
        ) => {
            return [args[0], disableVolumeAdjustSound(args[1], browserType)];
        },

        "Page:new": (page) => {
            // eslint-disable-next-line no-shadow
            page.addInitScript((video) => {
                // Execute script only in main frame.
                // eslint-disable-next-line no-undef, unicorn/prefer-global-this
                if (window !== top) {
                    return;
                }
                // eslint-disable-next-line no-undef
                addEventListener("load", () => {
                    // eslint-disable-next-line no-undef
                    const iframe = document.createElement("iframe");
                    iframe.src = `https://www.youtube-nocookie.com/embed/${video}`;
                    // eslint-disable-next-line no-undef
                    document.body.replaceChildren(iframe);
                });
            }, video);
            return page;
        },
    };
};

describe("Plugin: docs.rickroll", () => {
    it("should rick roll", async () => {
        const browser = await vanilla.chromium.launch({
            plugins: [rickrollPlugin(), vanilla.plugins.utils.debug()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://example.com/");
            const src = await page.locator("iframe").getAttribute("src");
            assert.equal(
                src,
                "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            );
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
