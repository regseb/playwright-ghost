/**
 * @module
 */

import playwright from "playwright";
import trace from "./trace.js";
import BrowserTypeHook from "./hook/browsertypehook.js";

export const firefox = trace(playwright.firefox, new BrowserTypeHook());
export const chromium = trace(playwright.chromium, new BrowserTypeHook());
