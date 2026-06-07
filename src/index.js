/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/* @ts-self-types="../types/index.d.ts" */

// Utiliser le `pw` afin de garder le nom `playwright` pour l'export par défaut.
import pw from "playwright";
import Ghost from "./ghost.js";

/**
 * @import { OptionPlugins } from "./ghost.js"
 */

/**
 * @typedef {import("playwright").Page} Page
 * @typedef {import("playwright").Frame} Frame
 * @typedef {import("playwright").BrowserContext} BrowserContext
 * @typedef {import("playwright").Browser} Browser
 * @typedef {import("playwright").Worker} Worker
 * @typedef {import("playwright").JSHandle} JSHandle
 * @typedef {import("playwright").ElementHandle} ElementHandle
 * @typedef {import("playwright").Locator} Locator
 * @typedef {import("playwright").CDPSession} CDPSession
 * @typedef {import("playwright").WebSocketRoute} WebSocketRoute
 * @typedef {import("playwright").ElectronApplication} ElectronApplication
 * @typedef {import("playwright").AndroidElementInfo} AndroidElementInfo
 * @typedef {import("playwright").AndroidSelector} AndroidSelector
 * @typedef {import("playwright").AndroidKey} AndroidKey
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
 * @typedef {Ghost<import("playwright").BrowserType>} BrowserType
 */

/**
 * @typedef {import("playwright").LaunchOptions & OptionPlugins} LaunchOptions
 * @typedef {import("playwright").ConnectOverCDPOptions & OptionPlugins} ConnectOverCDPOptions
 * @typedef {import("playwright").ConnectOptions & OptionPlugins} ConnectOptions
 */

/**
 * @type {BrowserType}
 */
export const chromium = new Ghost(pw.chromium);

/**
 * @type {BrowserType}
 */
export const firefox = new Ghost(pw.firefox);

/**
 * @type {BrowserType}
 */
export const webkit = new Ghost(pw.webkit);

export const selectors = pw.selectors;
export const devices = pw.devices;
export const errors = pw.errors;
export const request = pw.request;
// eslint-disable-next-line no-underscore-dangle
export const _electron = pw._electron;
// eslint-disable-next-line no-underscore-dangle
export const _android = pw._android;
const playwright = {
    ...pw,
    chromium,
    firefox,
    webkit,
};
export default playwright;
