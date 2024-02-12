/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import which from "../../utils/which.js";

/**
 * La liste des exécutables des navigateurs.
 *
 * @type {Map<string, string>}
 */
const EXECUTABLE_PATHS = new Map();
for (const name of ["chromium", "firefox", "webkit"]) {
    try {
        EXECUTABLE_PATHS.set(name, await which(name));
    } catch {
        // Ignorer les navigateurs qui n'ont pas été trouvés, car c'est normal
        // qu'ils ne soient pas tous installés. Par contre si le plugin est
        // utilisé avec un navigateur non-installé, le plugin remontera une
        // erreur.
    }
}

const setExecutablePath = function (options, browserType) {
    const name = browserType.name();
    if (!EXECUTABLE_PATHS.has(name)) {
        throw new Error(`${name} not found locally`);
    }
    return {
        executablePath: EXECUTABLE_PATHS.get(name),
        ...options,
    };
};

/**
 * Crée un plugin pour utiliser le navigateur installé localement.
 */
export default function localePlugin() {
    return {
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            return [setExecutablePath(args[0], browserType)];
        },

        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType },
        ) => {
            return [args[0], setExecutablePath(args[1], browserType)];
        },
    };
}
