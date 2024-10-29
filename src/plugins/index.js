/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import dialogPlugin from "./humanize/dialog.js";
import automationPlugin from "./polyfill/automation.js";
import headlessPlugin from "./polyfill/headless.js";
import screenPlugin from "./polyfill/screen.js";
import userAgentPlugin from "./polyfill/useragent.js";
import viewportPlugin from "./polyfill/viewport.js";
import webdriverPlugin from "./polyfill/webdriver.js";
import webGLPlugin from "./polyfill/webgl.js";
import adBlockerPlugin from "./utils/adblocker.js";
import debugPlugin from "./utils/debug.js";
import localePlugin from "./utils/locale.js";

export default {
    /**
     * Crée les plugins recommandés.
     *
     * @param {Object} [options]                   Les éventuels options des
     *                                             plugins recommandés.
     * @param {Object} [options.humanize]          Les éventuels options des
     *                                             plugins humanisant.
     * @param {Object} [options.humanize.dialog]   Les éventuels options du
     *                                             plugin des boîtes de
     *                                             dialogues.
     * @param {Object} [options.polyfill]          Les éventuels options des
     *                                             plugins de gommant les
     *                                             différences entre un
     *                                             navigateur utilisé par un
     *                                             être humain et un navigateur
     *                                             _headless_ contrôlé par un
     *                                             programme.
     * @param {Object} [options.polyfill.screen]   Les éventuels options du
     *                                             plugin de la taille de
     *                                             l'écran.
     * @param {Object} [options.polyfill.viewport] Les éventuels options du
     *                                             plugin de la taille de la
     *                                             fenêtre du navigateur.
     * @returns {Record<string, Function>[]} Les crochets des plugins
     *                                       recommandés.
     */
    recommended: (options) => [
        automationPlugin(),
        dialogPlugin(options?.humanize?.dialog),
        headlessPlugin(),
        screenPlugin(options?.polyfill?.screen),
        viewportPlugin(options?.polyfill?.viewport),
        webdriverPlugin(),
    ],
    humanize: {
        dialog: dialogPlugin,
    },
    polyfill: {
        automation: automationPlugin,
        headless: headlessPlugin,
        screen: screenPlugin,
        userAgent: userAgentPlugin,
        viewport: viewportPlugin,
        webdriver: webdriverPlugin,
        webGL: webGLPlugin,
    },
    utils: {
        adBlocker: adBlockerPlugin,
        debug: debugPlugin,
        locale: localePlugin,
    },
};
