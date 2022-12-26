/**
 * @module
 */

import BrowserIsHeadless from "./api/browser-isheadless.js";
import Browser from "./hook/browser.js";
import BrowserType from "./hook/browsertype.js";
import Dialog from "./humanize/dialog.js";
import Chrome from "./polyfill/chrome.js";
import MaxTouchPoints from "./polyfill/maxtouchpoints.js";
import NotificationPermission from "./polyfill/notification-permission.js";
import PdfViewerEnabled from "./polyfill/pdfviewerenabled.js";
import Plugins from "./polyfill/plugins.js";
import RTT from "./polyfill/rtt.js";
import SharedArrayBuffer from "./polyfill/sharedarraybuffer.js";
import UserAgent from "./polyfill/useragent.js";
import UserAgentData from "./polyfill/useragentdata.js";
import Viewport from "./polyfill/viewport.js";
import Webdriver from "./polyfill/webdriver.js";
import WebGL from "./polyfill/webgl.js";
import Blocker from "./util/blocker.js";
import Debug from "./util/debug.js";

export default [
    // Hook.
    BrowserType,
    Browser,

    // API.
    BrowserIsHeadless,

    // Polyfill.
    Chrome,
    MaxTouchPoints,
    NotificationPermission,
    PdfViewerEnabled,
    Plugins,
    RTT,
    SharedArrayBuffer,
    UserAgent,
    UserAgentData,
    Viewport,
    Webdriver,
    WebGL,

    // Humanize.
    Dialog,

    // Util.
    Blocker,
    Debug,
];
