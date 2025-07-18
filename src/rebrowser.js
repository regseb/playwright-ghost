/**
 * @module
 * @license MIT
 * @see https://github.com/rebrowser/rebrowser-playwright
 * @author Sébastien Règne
 */

import playwright from "rebrowser-playwright";
import Ghost from "./ghost.js";
import deprecatedPlugins from "./plugins/index.js";

/**
 * @deprecated As of release 0.14.0, replaced by
 *             `import plugins from "playwright-ghost/plugins";`
 */
export const plugins = deprecatedPlugins;

export const chromium = new Ghost(playwright.chromium);
export const firefox = new Ghost(playwright.firefox);
export const webkit = new Ghost(playwright.webkit);
export const selectors = playwright.selectors;
export const devices = playwright.devices;
export const errors = playwright.errors;
export const request = playwright.request;
// eslint-disable-next-line no-underscore-dangle
export const _electron = playwright._electron;
// eslint-disable-next-line no-underscore-dangle
export const _android = playwright._android;
export default {
    ...playwright,
    chromium,
    firefox,
    webkit,

    /**
     * @deprecated As of release 0.14.0, replaced by
     *             `import plugins from "playwright-ghost/plugins";`
     */
    plugins,
};
