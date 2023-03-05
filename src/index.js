/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import playwright from "playwright";
import hook from "./hook.js";
import BrowserTypePlugin from "./plugin/hook/browsertype.js";

/**
 * @typedef {import("playwright").BrowserType} BrowserType
 */

/**
 * Ajoute le plugin d'entrée dans un <code>BrowserType</code> de Playwright.
 *
 * @param {BrowserType} browserType Le <code>BrowserType</code> vanilla.
 * @returns {BrowserType} Le <code>BrowserType</code> avec le plugin.
 */
const plug = function (browserType) {
    return /** @type {BrowserType} */ (
        hook(browserType, [new BrowserTypePlugin()])
    );
};

export const chromium = plug(playwright.chromium);
export const firefox = plug(playwright.firefox);
export const webkit = plug(playwright.webkit);
export const selectors = playwright.selectors;
export const devices = playwright.devices;
export const errors = playwright.errors;
export const request = playwright.request;
// eslint-disable-next-line no-underscore-dangle
export const _electron = playwright._electron;
// eslint-disable-next-line no-underscore-dangle
export const _android = playwright._android;
export default { ...playwright, chromium };
