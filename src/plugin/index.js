/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import BrowserIsHeadlessPlugin from "./api/browser-isheadless.js";
import AdblockerPlugin from "./extension/adblocker.js";
import BrowserPlugin from "./hook/browser.js";
import BrowserContextPlugin from "./hook/browsercontext.js";
import PagePlugin from "./hook/page.js";
import DialogPlugin from "./humanize/dialog.js";
import CommonPlugin from "./polyfill/common.js";
import ViewportPlugin from "./polyfill/viewport.js";
import WebdriverPlugin from "./polyfill/webdriver.js";
import WebGLPlugin from "./polyfill/webgl.js";
import DebugPlugin from "./util/debug.js";
import LocalePlugin from "./util/locale.js";

export default [
    // Hook.
    BrowserPlugin,
    BrowserContextPlugin,
    PagePlugin,

    // API.
    BrowserIsHeadlessPlugin,

    // Polyfill.
    CommonPlugin,
    ViewportPlugin,
    WebdriverPlugin,
    WebGLPlugin,

    // Humanize.
    DialogPlugin,

    // Extension
    AdblockerPlugin,

    // Util.
    DebugPlugin,
    LocalePlugin,
];
