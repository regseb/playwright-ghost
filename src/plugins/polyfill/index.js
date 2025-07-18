/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import polyfillAutomationPlugin from "./automation.js";
import polyfillHeadlessPlugin from "./headless.js";
import polyfillRecommendedPlugins from "./recommended.js";
import polyfillScreenPlugin from "./screen.js";
import polyfillUserAgentPlugin from "./useragent.js";
import polyfillViewportPlugin from "./viewport.js";
import polyfillWebdriverPlugin from "./webdriver.js";
import polyfillWebGLPlugin from "./webgl.js";

/**
 * @typedef {import("./recommended.js").PolyfillRecommendedOptions} PolyfillRecommendedOptions
 * @typedef {import("./screen.js").PolyfillScreenOptions} PolyfillScreenOptions
 * @typedef {import("./useragent.js").PolyfillUserAgentOptions} PolyfillUserAgentOptions
 * @typedef {import("./viewport.js").PolyfillViewportOptions} PolyfillViewportOptions
 */

/**
 * Les plugins pour gommer des différences entre un navigateur utilisé par un
 * être humain et un navigateur _headless_ contrôlé par un programme.
 */
export default {
    automation: polyfillAutomationPlugin,
    headless: polyfillHeadlessPlugin,
    screen: polyfillScreenPlugin,
    userAgent: polyfillUserAgentPlugin,
    viewport: polyfillViewportPlugin,
    webdriver: polyfillWebdriverPlugin,
    webGL: polyfillWebGLPlugin,

    recommended: polyfillRecommendedPlugins,
};
