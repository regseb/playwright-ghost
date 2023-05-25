/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";

/**
 * La liste des répertoires à supprimer.
 *
 * @type {string[]}
 */
const PATHS = [
    // Supprimer les répertoires générés.
    ".stryker/",
    "jsdocs/",
    "log/",
    "node_modules/",
    // Supprimer les autres lockfiles.
    "pnpm-lock.yaml",
    "yarn.lock",
];

for (const path of PATHS) {
    fs.rm(path, { force: true, recursive: true });
}
