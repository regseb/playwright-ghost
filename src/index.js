/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import playwright from "playwright";
import Ghost from "./ghost.js";
import deprecatedPlugins from "./plugins/index.js";

/**
 * @typedef {import("playwright").Page} Page
 * @typedef {import("playwright").Frame} Frame
 * @typedef {import("playwright").BrowserContext} BrowserContext
 * @typedef {import("playwright").Browser} Browser
 * @typedef {import("playwright").Worker} Worker
 * @typedef {import("playwright").JSHandle} JSHandle
 * @typedef {import("playwright").ElementHandle} ElementHandle
 * @typedef {import("playwright").Locator} Locator
 * @typedef {import("playwright").BrowserType} BrowserType
 * @typedef {import("playwright").CDPSession} CDPSession
 * @typedef {import("playwright").WebSocketRoute} WebSocketRoute
 * @typedef {import("playwright").Accessibility} Accessibility
 * @typedef {import("playwright").ElectronApplication} ElectronApplication
 * @typedef {import("playwright").AndroidElementInfo} AndroidElementInfo
 * @typedef {import("playwright").AndroidSelector} AndroidSelector
 * @typedef {import("playwright").AndroidKey} AndroidKey
 * @typedef {import("playwright")._bidiChromium} _bidiChromium
 * @typedef {import("playwright")._bidiFirefox} _bidiFirefox
 * @typedef {import("playwright").Android} Android
 * @typedef {import("playwright").AndroidDevice} AndroidDevice
 * @typedef {import("playwright").AndroidInput} AndroidInput
 * @typedef {import("playwright").AndroidSocket} AndroidSocket
 * @typedef {import("playwright").AndroidWebView} AndroidWebView
 * @typedef {import("playwright").APIRequest} APIRequest
 * @typedef {import("playwright").APIRequestContext} APIRequestContext
 * @typedef {import("playwright").APIResponse} APIResponse
 * @typedef {import("playwright").BrowserServer} BrowserServer
 * @typedef {import("playwright").Clock} Clock
 * @typedef {import("playwright").ConsoleMessage} ConsoleMessage
 * @typedef {import("playwright").Coverage} Coverage
 * @typedef {import("playwright").Dialog} Dialog
 * @typedef {import("playwright").Download} Download
 * @typedef {import("playwright").Electron} Electron
 * @typedef {import("playwright").FileChooser} FileChooser
 * @typedef {import("playwright").FrameLocator} FrameLocator
 * @typedef {import("playwright").Keyboard} Keyboard
 * @typedef {import("playwright").Logger} Logger
 * @typedef {import("playwright").Mouse} Mouse
 * @typedef {import("playwright").Request} Request
 * @typedef {import("playwright").Response} Response
 * @typedef {import("playwright").Route} Route
 * @typedef {import("playwright").Selectors} Selectors
 * @typedef {import("playwright").Touchscreen} Touchscreen
 * @typedef {import("playwright").Tracing} Tracing
 * @typedef {import("playwright").Video} Video
 * @typedef {import("playwright").WebError} WebError
 * @typedef {import("playwright").WebSocket} WebSocket
 * @typedef {import("playwright").LaunchOptions} LaunchOptions
 * @typedef {import("playwright").ConnectOverCDPOptions} ConnectOverCDPOptions
 * @typedef {import("playwright").ConnectOptions} ConnectOptions
 * @typedef {import("playwright").LocatorScreenshotOptions} LocatorScreenshotOptions
 * @typedef {import("playwright").BrowserContextOptions} BrowserContextOptions
 * @typedef {import("playwright").ViewportSize} ViewportSize
 * @typedef {import("playwright").HTTPCredentials} HTTPCredentials
 * @typedef {import("playwright").Geolocation} Geolocation
 * @typedef {import("playwright").Cookie} Cookie
 * @typedef {import("playwright").PageScreenshotOptions} PageScreenshotOptions
 * @typedef {import("playwright").ChromiumBrowserContext} ChromiumBrowserContext
 * @typedef {import("playwright").ChromiumBrowser} ChromiumBrowser
 * @typedef {import("playwright").FirefoxBrowser} FirefoxBrowser
 * @typedef {import("playwright").WebKitBrowser} WebKitBrowser
 * @typedef {import("playwright").ChromiumCoverage} ChromiumCoverage
 */

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
