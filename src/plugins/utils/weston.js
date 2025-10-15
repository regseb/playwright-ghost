/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { spawn } from "node:child_process";
import process from "node:process";

/**
 * @import { ChildProcess } from "node:child_process"
 * @import { BrowserType } from "playwright"
 * @import { ContextBefore } from "../../hook.js"
 */

/**
 * @typedef {Object} InstanceWeston Le type d'une instance de `weston`.
 * @prop {ChildProcess} process   Le processus exécutant `weston`.
 * @prop {string}       display   Le `WAYLAND_DISPLAY` du socket de `weston`.
 * @prop {number}       count     Le nombre de navigateurs utilisant l'instance.
 * @prop {boolean}      keepalive La marque pour ne pas arrêter l'exécutable de
 *                                `weston` après la fermeture du navigateur.
 */

/**
 * Instance de `weston`.
 *
 * @type {Map<string[], InstanceWeston>}
 */
const westons = new Map();

/**
 * Hache des arguments pour avoir une valeur à mettre dans le _display_ /
 * _socket_ de `weston`.
 *
 * @param {string[]} args Les arguments passés à l'exécutable `weston`.
 * @returns {string} Le hachage des arguments.
 */
const hashCode = (args) => {
    return Math.abs(
        Array.from(JSON.stringify(args)).reduce((code, character) => {
            return (code << 5) - code + character.codePointAt(0);
        }, 0),
    ).toString(36);
};

/**
 * Exécute `weston` avec les arguments donnés.
 *
 * @param {string[]} args      Les arguments passés à l'exécutable `weston`.
 * @param {boolean}  keepalive La marque pour ne pas arrêter l'exécutable de
 *                             `weston` après la fermeture du navigateur.
 * @returns {string} Le `WAYLAND_DISPLAY` du socket de `weston`.
 */
const spawnWeston = (args, keepalive) => {
    const weston = westons.get(args);
    if (undefined !== weston) {
        ++weston.count;
        weston.keepalive ||= keepalive;
        return weston.display;
    }

    // Ajouter le hachage des arguments pour avoir un display / socket unique.
    const display = `playwright-ghost-${hashCode(args)}`;
    westons.set(args, {
        process: spawn(
            "weston",
            [
                "--no-config",
                "--backend=headless-backend.so",
                `--socket=${display}`,
                ...args,
            ],
            { stdio: "inherit" },
        ),
        display,
        count: 1,
        keepalive,
    });
    return display;
};

/**
 * Arrête éventuellement l'exécutable de `weston` si l'option `keepalive` n'est
 * pas activée et si plus aucun navigateur ne l'utilise.
 *
 * @param {string[]} args Les arguments passés à l'exécutable `weston` (pour
 *                        retrouver son instance).
 */
const killWeston = (args) => {
    const weston = westons.get(args);
    if (undefined !== weston) {
        --weston.count;
        if (!weston.keepalive && 0 === weston.count) {
            weston.process.kill();
            westons.delete(args);
        }
    }
};

/**
 * Définit le `DISPLAY` (du serveur de `weston`) dans les options de création
 * d'un `Browser`.
 *
 * @param {Record<string, any>|undefined} options     Les options de création
 *                                                    d'un `Browser`.
 * @param {string}                        display     Le `DISPLAY` du serveur de
 *                                                    `weston` (par exemple :
 *                                                    `:0`).
 * @param {BrowserType}                   browserType Le type de navigateur.
 * @returns {Record<string, any>} Les nouvelles options.
 */
const setDisplay = (options, display, browserType) => {
    if ("chromium" === browserType.name()) {
        return {
            ...options,
            // Forcer l'utilisation de la plateforme Wayland dans le cas où
            // Chromium utiliserait X11.
            args: ["--ozone-platform=wayland", ...(options?.args ?? [])],
            env:
                // Utilise `process.env` par défaut, car c'est la valeur
                // utilisée par Playwright.
                // https://playwright.dev/docs/api/class-browsertype#browser-type-launch-option-env
                undefined === options?.env
                    ? { ...process.env, WAYLAND_DISPLAY: display }
                    : { ...options.env, WAYLAND_DISPLAY: display },
        };
    }

    return {
        ...options,
        env:
            // Utilise `process.env` par défaut, car c'est la valeur utilisée
            // par Playwright.
            // https://playwright.dev/docs/api/class-browsertype#browser-type-launch-option-env
            undefined === options?.env
                ? { ...process.env, WAYLAND_DISPLAY: display }
                : { ...options.env, WAYLAND_DISPLAY: display },
    };
};

/**
 * @typedef {Object} UtilsWestonOptions Les options du plugin `utils.weston`.
 * @prop {string[]}    [args]      Les arguments passés de l'exécutable
 *                                 `weston`.
 * @prop {boolean}     [keepalive] La marque pour ne pas arrêter l'exécutable de
 *                                 `weston` après la fermeture du navigateur.
 * @prop {AbortSignal} [signal]    Le signal pour tuer l'exécutable de `weston`.
 */

/**
 * Crée un plugin pour exécuter le navigateur avec `weston`.
 *
 * @param {UtilsWestonOptions} [options] Les éventuelles options du plugin
 *                                       `utils.weston`.
 * @returns {Record<string, Function|Record<symbol, Record<string, Function>>>} Les
 *                                                                              crochets
 *                                                                              du
 *                                                                              plugin.
 */
export default function utilsWestonPlugin(options) {
    /**
     * Arguments passés à l'exécutable `weston`.
     *
     * Par défaut `weston` simule un écran ayant la définition _1024x640_.
     * Cette taille n'étant plus très commune, la définition plus courante
     * _1920x1080_ est utilisée par défaut.
     *
     * @type {string[]}
     */
    const westonArgs = options?.args ?? ["--width", "1920", "--height", "1080"];

    /**
     * Marque pour ne pas arrêter l'exécutable de `weston` après la fermeture du
     * navigateur.
     *
     * @type {boolean}
     */
    const keepalive = options?.keepalive ?? false;

    if (undefined !== options?.signal) {
        // Écouter le signal pour tuer l'exécutable de `weston`.
        options.signal.addEventListener("abort", () => {
            const weston = westons.get(westonArgs);
            if (undefined !== weston) {
                weston.process.kill();
                westons.delete(westonArgs);
            }
        });
    }

    return {
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            const display = spawnWeston(westonArgs, keepalive);
            return [setDisplay(args[0], display, browserType)];
        },

        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType },
        ) => {
            const display = spawnWeston(westonArgs, keepalive);
            return [args[0], setDisplay(args[1], display, browserType)];
        },

        /**
         * Arrête éventuellement l'exécutable de `weston` à la fermeture du
         * navigateur.
         *
         * @param {any} returnValue _Void_
         * @returns {any} _Void_
         */
        "Browser.close:after": (returnValue) => {
            killWeston(westonArgs);
            return returnValue;
        },

        Browser: {
            [Symbol.asyncDispose]: {
                /**
                 * Arrête éventuellement l'exécutable de `weston` à la fermeture
                 * automatique du navigateur.
                 *
                 * @param {any} returnValue _Void_
                 * @returns {any} _Void_
                 */
                after: (returnValue) => {
                    killWeston(westonArgs);
                    return returnValue;
                },
            },
        },
    };
}
