/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/* @ts-self-types="../../../types/plugins/debug/index.d.ts" */

import debugConsolePlugin from "./console.js";
import debugCursorPlugin from "./cursor.js";
import debugSnifferPlugin from "./sniffer.js";

/**
 * @typedef {import("./console.js").DebugConsoleOptions} DebugConsoleOptions
 */

/**
 * Les plugins de débogage.
 */
const debugPlugins = {
    console: debugConsolePlugin,
    cursor: debugCursorPlugin,
    sniffer: debugSnifferPlugin,
};
export default debugPlugins;
