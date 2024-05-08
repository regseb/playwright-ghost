/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import dialogPlugin from "./humanize/dialog.js";
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
        automationPlugin(),
        dialogPlugin(options?.humanize?.dialog),
        headlessPlugin(),
        screenPlugin(options?.polyfill?.screen),
        viewportPlugin(options?.polyfill?.viewport),
        webdriverPlugin(),
        webGLPlugin(),
    ],
    humanize: {
        dialogPlugin,
    },
    polyfill: {
        headlessPlugin,
        screenPlugin,
        userAgentPlugin,
        viewportPlugin,
        webdriverPlugin,
        webGLPlugin,
    },
    utils: {
        adBlockerPlugin,
        debugPlugin,
        localePlugin,
    },
};
