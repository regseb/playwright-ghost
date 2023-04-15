/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import which from "../../utils/which.js";
import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

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
        // Ignorer les navigateurs qui n'ont pas été trouvés car c'est normal
        // qu'ils ne sont pas tous installés. Par contre si le plugin est
        // utilisé avec un navigareur non-installé, le plugin remontera une
        // erreur.
    }
}

export default class LocalePlugin extends Plugin {
    /**
     * La clé du plugin.
     *
     * @type {string}
     */
    static key = "util/locale";

    /**
     * Le niveau du plugin.
     *
     * @type {string}
     */
    static level = LEVELS.DISABLED;

    constructor() {
        super();
        this.addHook(
            "BrowserType.launch:before",
            this.#changeExecutablePath.bind(this),
        );
    }

    // eslint-disable-next-line class-methods-use-this
    #changeExecutablePath(args, { obj: browserType }) {
        const name = browserType.name();
        if (!EXECUTABLE_PATHS.has(name)) {
            throw new Error(`${name} not found locally`);
        }
        return [
            {
                executablePath: EXECUTABLE_PATHS.get(name),
                ...args[0],
            },
        ];
    }
}
