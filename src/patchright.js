/**
 * @module
 * @license MIT
 * @see https://github.com/Kaliiiiiiiiii-Vinyzu/patchright-nodejs
 * @author Sébastien Règne
 */

import playwright from "patchright";
import Ghost from "./ghost.js";

/**
 * @typedef {import("patchright").Page} Page
 * @typedef {import("patchright").Frame} Frame
 * @typedef {import("patchright").BrowserContext} BrowserContext
 * @typedef {import("patchright").Browser} Browser
 * @typedef {import("patchright").Worker} Worker
 * @typedef {import("patchright").JSHandle} JSHandle
 * @typedef {import("patchright").ElementHandle} ElementHandle
 * @typedef {import("patchright").Locator} Locator
 * @typedef {import("patchright").BrowserType} BrowserType
 * @typedef {import("patchright").CDPSession} CDPSession
 * @typedef {import("patchright").WebSocketRoute} WebSocketRoute
 * @typedef {import("patchright").Accessibility} Accessibility
 * @typedef {import("patchright").ElectronApplication} ElectronApplication
 * @typedef {import("patchright").AndroidElementInfo} AndroidElementInfo
 * @typedef {import("patchright").AndroidSelector} AndroidSelector
 * @typedef {import("patchright").AndroidKey} AndroidKey
 * @typedef {import("patchright")._bidiChromium} _bidiChromium
 * @typedef {import("patchright")._bidiFirefox} _bidiFirefox
 * @typedef {import("patchright").Android} Android
 * @typedef {import("patchright").AndroidDevice} AndroidDevice
 * @typedef {import("patchright").AndroidInput} AndroidInput
 * @typedef {import("patchright").AndroidSocket} AndroidSocket
 * @typedef {import("patchright").AndroidWebView} AndroidWebView
 * @typedef {import("patchright").APIRequest} APIRequest
 * @typedef {import("patchright").APIRequestContext} APIRequestContext
 * @typedef {import("patchright").APIResponse} APIResponse
 * @typedef {import("patchright").BrowserServer} BrowserServer
 * @typedef {import("patchright").Clock} Clock
 * @typedef {import("patchright").ConsoleMessage} ConsoleMessage
 * @typedef {import("patchright").Coverage} Coverage
 * @typedef {import("patchright").Dialog} Dialog
 * @typedef {import("patchright").Download} Download
 * @typedef {import("patchright").Electron} Electron
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
 * @typedef {import("patchright").LaunchOptions} LaunchOptions
 * @typedef {import("patchright").ConnectOverCDPOptions} ConnectOverCDPOptions
 * @typedef {import("patchright").ConnectOptions} ConnectOptions
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
