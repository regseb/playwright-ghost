/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import debugConsolePlugin from "./console.js";
import debugCursorPlugin from "./cursor.js";

/**
 * @typedef {import("./console.js").DebugConsoleOptions} DebugConsoleOptions
 */

/**
 * Les plugins de débogage.
 */
export default {
    console: debugConsolePlugin,
    cursor: debugCursorPlugin,
};
