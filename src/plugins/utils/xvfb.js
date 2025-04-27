/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import process from "node:process";

/**
 * @import { ChildProcess } from "node:child_process"
 */

/**
 * @typedef {Object} InstanceXvfb Le type d'une instance de `Xvfb`.
 * @prop {ChildProcess} process   Le processus exécutant `Xvfb`.
 * @prop {string}       display   Le `DISPLAY` du serveur de `Xvfb` (par
 *                                exemple : `:99`).
 * @prop {number}       count     Le nombre de navigateurs utilisant l'instance.
 * @prop {boolean}      keepalive La marque pour ne pas arrêter l'exécutable de
 *                                `Xvfb` après la fermeture navigateur.
 */

/**
 * Instances de `Xvfb`.
 *
 * @type {Map<string[], InstanceXvfb>}
 */
const xvfbs = new Map();

/**
 * Teste si un fichier existe.
 *
 * @param {string} path Le chemin du fichier.
 * @returns {Promise<boolean>} Une promesse avec `true` si le fichier existe ;
 *                             sinon `false`.
 */
export const exists = async (path) => {
    try {
        await fs.access(path, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

/**
 * Exécute `Xvfb` avec les arguments donnés.
 *
 * @param {string[]} args      Les arguments passés à l'exécutable `Xvfb`.
 * @param {boolean}  keepalive La marque pour ne pas arrêter l'exécutable de
 *                             `Xvfb` après la fermeture navigateur.
 * @returns {Promise<string>} Le `DISPLAY` du serveur de `Xvfb` (par exemple :
 *                            `:99`).
 */
const spawnXvfb = async (args, keepalive) => {
    const xvfb = xvfbs.get(args);
    if (undefined !== xvfb) {
        ++xvfb.count;
        xvfb.keepalive ||= keepalive;
        return xvfb.display;
    }

    let serverNumber = 99;
    let lockFile = `/tmp/.X${serverNumber}-lock`;
    while (await exists(lockFile)) {
        ++serverNumber;
        lockFile = `/tmp/.X${serverNumber}-lock`;
    }
    const display = `:${serverNumber}`;

    xvfbs.set(args, {
        process: spawn("Xvfb", [display, ...args], { stdio: "inherit" }),
        display,
        count: 1,
        keepalive,
    });
    return display;
};

/**
 * Définit le `DISPLAY` (du serveur de `Xvfb`) dans les options de création d'un
 * `Browser`.
 *
 * @param {Record<string, any>|undefined} options Les options de création d'un
 *                                                `Browser`.
 * @param {string}                        display Le `DISPLAY` du serveur de
 *                                                `Xvfb` (par exemple : `:99`).
 * @returns {Record<string, any>} Les nouvelles options.
 */
const setDisplay = (options, display) => {
    return {
        ...options,
        env:
            undefined === options?.env
                ? { ...process.env, DISPLAY: display }
                : { ...options.env, DISPLAY: display },
    };
};

/**
 * @typedef {Object} XvfbOptions Les options du plugin `utils.xvfb`.
 * @prop {string[]}    [args]      Les arguments passés de l'exécutable `Xvfb`.
 * @prop {boolean}     [keepalive] La marque pour ne pas arrêter l'exécutable de
 *                                 `Xvfb` après la fermeture du navigateur.
 * @prop {AbortSignal} [signal]    Le signal pour tuer l'exécutable de `Xvfb`.
 */

/**
 * Crée un plugin pour exécuter le navigateur avec `Xvfb`.
 *
 * @param {XvfbOptions} [options] Les éventuelles options du plugin
 *                                `utils.xvfb`.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function xvfbPlugin(options) {
    /**
     * Arguments passés à l'exécutable `Xvfb`.
     *
     * Par défaut `Xvfb` simule un écran ayant la définition _1280x1024x8_.
     * Cette taille n'étant plus très commune, la définition plus courante
     * _1920x1080x24_ est utilisée par défaut.
     *
     * @type {string[]}
     */
    const xvfbArgs = options?.args ?? ["-screen", "0", "1920x1080x24"];

    /**
     * Marque pour ne pas arrêter l'exécutable de `Xvfb` après la fermeture du
     * navigateur.
     *
     * @type {boolean}
     */
    const keepalive = options?.keepalive ?? false;

    if (undefined !== options?.signal) {
        // Écouter le signal pour tuer l'exécutable de `Xvfb`.
        options.signal.addEventListener("abort", () => {
            const xvfb = xvfbs.get(xvfbArgs);
            if (undefined !== xvfb) {
                xvfb.process.kill();
                xvfbs.delete(xvfbArgs);
            }
        });
    }

    return {
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "BrowserType.launch:before": async (args) => {
            const display = await spawnXvfb(xvfbArgs, keepalive);
            return [setDisplay(args[0], display)];
        },

        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "BrowserType.launchPersistentContext:before": async (args) => {
            const display = await spawnXvfb(xvfbArgs, keepalive);
            return [args[0], setDisplay(args[1], display)];
        },

        /**
         * Tue éventuellement l'exécutable de `Xvfb` à la fermeture du
         * navigateur.
         *
         * @param {any} returnValue _Void_
         * @returns {any} _Void_
         */
        "Browser.close:after": (returnValue) => {
            const xvfb = xvfbs.get(xvfbArgs);
            if (undefined !== xvfb) {
                --xvfb.count;
                if (!xvfb.keepalive && 0 === xvfb.count) {
                    xvfb.process.kill();
                    xvfbs.delete(xvfbArgs);
                }
            }
            return returnValue;
        },
    };
}
