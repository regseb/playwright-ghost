/**
 * @module
 */

import BrowserType from "./api/browserType/index.js";
import IsHeadless from "./api/isHeadless/index.js";
import DoNotTrack from "./polyfill/doNotTrack/index.js";
import Plugins from "./polyfill/plugins/index.js";
import Screen from "./polyfill/screen/index.js";
import UserAgent from "./polyfill/userAgent/index.js";
import Viewport from "./polyfill/viewport/index.js";
import Webdriver from "./polyfill/webdriver/index.js";

export default [
    // API.
    BrowserType,
    IsHeadless,

    // Polyfill.
    DoNotTrack,
    Plugins,
    Screen,
    UserAgent,
    Viewport,
    Webdriver,
];
