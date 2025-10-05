/**
 * @module
 * @license MIT
 * @see https://github.com/rebrowser/rebrowser-playwright
 * @author Sébastien Règne
 */

import playwright from "rebrowser-playwright";
import Ghost from "./ghost.js";

/**
 * @typedef {import("rebrowser-playwright").Page} Page
 * @typedef {import("rebrowser-playwright").Frame} Frame
 * @typedef {import("rebrowser-playwright").BrowserContext} BrowserContext
 * @typedef {import("rebrowser-playwright").Browser} Browser
 * @typedef {import("rebrowser-playwright").Worker} Worker
 * @typedef {import("rebrowser-playwright").JSHandle} JSHandle
 * @typedef {import("rebrowser-playwright").ElementHandle} ElementHandle
 * @typedef {import("rebrowser-playwright").Locator} Locator
 * @typedef {import("rebrowser-playwright").BrowserType} BrowserType
 * @typedef {import("rebrowser-playwright").CDPSession} CDPSession
 * @typedef {import("rebrowser-playwright").WebSocketRoute} WebSocketRoute
 * @typedef {import("rebrowser-playwright").Accessibility} Accessibility
 * @typedef {import("rebrowser-playwright").ElectronApplication} ElectronApplication
 * @typedef {import("rebrowser-playwright").AndroidElementInfo} AndroidElementInfo
 * @typedef {import("rebrowser-playwright").AndroidSelector} AndroidSelector
 * @typedef {import("rebrowser-playwright").AndroidKey} AndroidKey
 * @typedef {import("rebrowser-playwright")._bidiChromium} _bidiChromium
 * @typedef {import("rebrowser-playwright")._bidiFirefox} _bidiFirefox
 * @typedef {import("rebrowser-playwright").Android} Android
 * @typedef {import("rebrowser-playwright").AndroidDevice} AndroidDevice
 * @typedef {import("rebrowser-playwright").AndroidInput} AndroidInput
 * @typedef {import("rebrowser-playwright").AndroidSocket} AndroidSocket
 * @typedef {import("rebrowser-playwright").AndroidWebView} AndroidWebView
 * @typedef {import("rebrowser-playwright").APIRequest} APIRequest
 * @typedef {import("rebrowser-playwright").APIRequestContext} APIRequestContext
 * @typedef {import("rebrowser-playwright").APIResponse} APIResponse
 * @typedef {import("rebrowser-playwright").BrowserServer} BrowserServer
 * @typedef {import("rebrowser-playwright").Clock} Clock
 * @typedef {import("rebrowser-playwright").ConsoleMessage} ConsoleMessage
 * @typedef {import("rebrowser-playwright").Coverage} Coverage
 * @typedef {import("rebrowser-playwright").Dialog} Dialog
 * @typedef {import("rebrowser-playwright").Download} Download
 * @typedef {import("rebrowser-playwright").Electron} Electron
 * @typedef {import("rebrowser-playwright").FileChooser} FileChooser
 * @typedef {import("rebrowser-playwright").FrameLocator} FrameLocator
 * @typedef {import("rebrowser-playwright").Keyboard} Keyboard
 * @typedef {import("rebrowser-playwright").Logger} Logger
 * @typedef {import("rebrowser-playwright").Mouse} Mouse
 * @typedef {import("rebrowser-playwright").Request} Request
 * @typedef {import("rebrowser-playwright").Response} Response
 * @typedef {import("rebrowser-playwright").Route} Route
 * @typedef {import("rebrowser-playwright").Selectors} Selectors
 * @typedef {import("rebrowser-playwright").Touchscreen} Touchscreen
 * @typedef {import("rebrowser-playwright").Tracing} Tracing
 * @typedef {import("rebrowser-playwright").Video} Video
 * @typedef {import("rebrowser-playwright").WebError} WebError
 * @typedef {import("rebrowser-playwright").WebSocket} WebSocket
 * @typedef {import("rebrowser-playwright").LaunchOptions} LaunchOptions
 * @typedef {import("rebrowser-playwright").ConnectOverCDPOptions} ConnectOverCDPOptions
 * @typedef {import("rebrowser-playwright").ConnectOptions} ConnectOptions
 * @typedef {import("rebrowser-playwright").LocatorScreenshotOptions} LocatorScreenshotOptions
 * @typedef {import("rebrowser-playwright").BrowserContextOptions} BrowserContextOptions
 * @typedef {import("rebrowser-playwright").ViewportSize} ViewportSize
 * @typedef {import("rebrowser-playwright").HTTPCredentials} HTTPCredentials
 * @typedef {import("rebrowser-playwright").Geolocation} Geolocation
 * @typedef {import("rebrowser-playwright").Cookie} Cookie
 * @typedef {import("rebrowser-playwright").PageScreenshotOptions} PageScreenshotOptions
 * @typedef {import("rebrowser-playwright").ChromiumBrowserContext} ChromiumBrowserContext
 * @typedef {import("rebrowser-playwright").ChromiumBrowser} ChromiumBrowser
 * @typedef {import("rebrowser-playwright").FirefoxBrowser} FirefoxBrowser
 * @typedef {import("rebrowser-playwright").WebKitBrowser} WebKitBrowser
 * @typedef {import("rebrowser-playwright").ChromiumCoverage} ChromiumCoverage
 */

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
};
