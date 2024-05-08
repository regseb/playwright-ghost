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
    recommendeds: (options) => [
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
