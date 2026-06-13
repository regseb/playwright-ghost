/**
 * @module
 * @license MIT
 * @see https://github.com/Kaliiiiiiiiii-Vinyzu/patchright-nodejs
 * @author Sébastien Règne
 */

/* @ts-self-types="../types/patchright.d.ts" */

import patchright from "patchright";
import Ghost from "./ghost.js";

/**
 * @import { OptionPlugins } from "./ghost.js"
 */

/**
 * @typedef {import("patchright").Page} Page
 * @typedef {import("patchright").Frame} Frame
 * @typedef {import("patchright").BrowserContext} BrowserContext
 * @typedef {import("patchright").Browser} Browser
 * @typedef {import("patchright").Worker} Worker
 * @typedef {import("patchright").JSHandle} JSHandle
 * @typedef {import("patchright").ElementHandle} ElementHandle
 * @typedef {import("patchright").Locator} Locator
 * @typedef {import("patchright").CDPSession} CDPSession
 * @typedef {import("patchright").WebSocketRoute} WebSocketRoute
 * @typedef {import("patchright").Screencast} Screencast
 * @typedef {import("patchright").ElectronApplication} ElectronApplication
 * @typedef {import("patchright").AndroidElementInfo} AndroidElementInfo
 * @typedef {import("patchright").AndroidSelector} AndroidSelector
 * @typedef {import("patchright").AndroidKey} AndroidKey
 * @typedef {import("patchright").APIRequest} APIRequest
 * @typedef {import("patchright").APIRequestContext} APIRequestContext
 * @typedef {import("patchright").APIResponse} APIResponse
 * @typedef {import("patchright").BrowserServer} BrowserServer
 * @typedef {import("patchright").Clock} Clock
 * @typedef {import("patchright").ConsoleMessage} ConsoleMessage
 * @typedef {import("patchright").Coverage} Coverage
 * @typedef {import("patchright").Debugger} Debugger
 * @typedef {import("patchright").Dialog} Dialog
 * @typedef {import("patchright").Disposable} Disposable
 * @typedef {import("patchright").Download} Download
 * @typedef {import("patchright").FileChooser} FileChooser
 * @typedef {import("patchright").FrameLocator} FrameLocator
 * @typedef {import("patchright").Keyboard} Keyboard
 * @typedef {import("patchright").Logger} Logger
 * @typedef {import("patchright").Mouse} Mouse
 * @typedef {import("patchright").Request} Request
 * @typedef {import("patchright").Response} Response
 * @typedef {import("patchright").Route} Route
 * @typedef {import("patchright").Selectors} Selectors
 * @typedef {import("patchright").Touchscreen} Touchscreen
 * @typedef {import("patchright").Tracing} Tracing
 * @typedef {import("patchright").Video} Video
 * @typedef {import("patchright").WebError} WebError
 * @typedef {import("patchright").WebSocket} WebSocket
 * @typedef {import("patchright").Electron} Electron
 * @typedef {import("patchright").Android} Android
 * @typedef {import("patchright").AndroidDevice} AndroidDevice
 * @typedef {import("patchright").AndroidInput} AndroidInput
 * @typedef {import("patchright").AndroidSocket} AndroidSocket
 * @typedef {import("patchright").AndroidWebView} AndroidWebView
 * @typedef {import("patchright").LocatorScreenshotOptions} LocatorScreenshotOptions
 * @typedef {import("patchright").BrowserContextOptions} BrowserContextOptions
 * @typedef {import("patchright").ViewportSize} ViewportSize
 * @typedef {import("patchright").HTTPCredentials} HTTPCredentials
 * @typedef {import("patchright").Geolocation} Geolocation
 * @typedef {import("patchright").Cookie} Cookie
 * @typedef {import("patchright").PageScreenshotOptions} PageScreenshotOptions
 * @typedef {import("patchright").ChromiumBrowserContext} ChromiumBrowserContext
 * @typedef {import("patchright").ChromiumBrowser} ChromiumBrowser
 * @typedef {import("patchright").FirefoxBrowser} FirefoxBrowser
 * @typedef {import("patchright").WebKitBrowser} WebKitBrowser
 * @typedef {import("patchright").ChromiumCoverage} ChromiumCoverage
 */

/**
 * @typedef {Ghost<import("patchright").BrowserType>} BrowserType
 */

/**
 * @typedef {import("patchright").LaunchOptions & OptionPlugins} LaunchOptions
 * @typedef {import("patchright").ConnectOverCDPOptions & OptionPlugins} ConnectOverCDPOptions
 * @typedef {import("patchright").ConnectOptions & OptionPlugins} ConnectOptions
 */

/**
 * @type {BrowserType}
 */
export const chromium = new Ghost(patchright.chromium);

/**
 * @type {BrowserType}
 */
export const firefox = new Ghost(patchright.firefox);

/**
 * @type {BrowserType}
 */
export const webkit = new Ghost(patchright.webkit);

export const selectors = patchright.selectors;
export const devices = patchright.devices;
export const errors = patchright.errors;
export const request = patchright.request;
// eslint-disable-next-line no-underscore-dangle
export const _electron = patchright._electron;
// eslint-disable-next-line no-underscore-dangle
export const _android = patchright._android;
const playwright = {
    ...patchright,
    chromium,
    firefox,
    webkit,
};
export default playwright;
