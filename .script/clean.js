/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";

/**
 * La liste des répertoires générés.
 *
 * @type {string[]}
 */
const PATHS = [
    // Ignorer les répertoires générés.
    ".stryker/",
    "jsdocs/",
    "log/",
    "node_modules/",
    // Ignorer les autres lockfile.
    "pnpm-lock.yaml",
    "yarn.lock",
];

for (const path of PATHS) {
    fs.rm(path, { force: true, recursive: true });
}
