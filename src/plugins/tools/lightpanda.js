/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { lightpanda as Lightpanda } from "@lightpanda/browser";

/**
 * @import { ChildProcess } from "node:child_process"
 * @import { LightpandaServeOptions } from "@lightpanda/browser"
 */

/**
 * @typedef {Object} InstanceLightpanda Le type d'une instance de _lightpanda_.
 * @prop {ChildProcess} process    Le processus exécutant _lightpanda_.
 * @prop {string}       wsEndpoint L'URL du serveur de _lightpanda_.
 * @prop {number}       count      Le nombre de navigateurs utilisant
 *                                 l'instance ; ou l'infini s'il ne faut pas
 *                                 arrêter l'exécutable de _lightpanda_ après la
 *                                 fermeture du navigateur.
 */

/**
 * Instances de _lightpanda_.
 *
 * @type {Map<string, InstanceLightpanda>}
 */
const lightpandas = new Map();

/**
 * Exécute _lightpanda_ avec les options données.
 *
 * @param {LightpandaServeOptions} options   Les options passées à la fonction
 *                                           `serve` de _lightpanda_.
 * @param {boolean}                keepalive La marque pour ne pas arrêter
 *                                           l'exécutable de _lightpanda_ après
 *                                           la fermeture du navigateur.
 * @returns {Promise<string>} Une promesse contenant l'URL du serveur de
 *                            _lightpanda_.
 */
const serveLightpanda = async (options, keepalive) => {
    const key = JSON.stringify(options);
    const lightpanda = lightpandas.get(key);
    if (undefined !== lightpanda) {
        // Utiliser l'infini pour que le compteur ne puisse plus redescendre et
        // ne pas arrêter l'exécutable de _lightpanda_.
        lightpanda.count += keepalive ? Infinity : 1;
        return lightpanda.wsEndpoint;
    }

    const wsEndpoint = `ws://${options.host}:${options.port}`;
    lightpandas.set(key, {
        process: await Lightpanda.serve(options),
        wsEndpoint,
        // Utiliser l'infini pour que le compteur ne puisse pas redescendre et
        // ne pas arrêter l'exécutable de _lightpanda_.
        count: keepalive ? Infinity : 1,
    });
    return wsEndpoint;
};

/**
 * Arrête éventuellement l'exécutable de _lightpanda_ si l'option `keepalive`
 * n'est pas activée et si plus aucun navigateur ne l'utilise.
 *
 * @param {LightpandaServeOptions} options Les options passées à la fonction
 *                                         `serve` de _lightpanda_ (pour
 *                                         retrouver son instance).
 * @param {boolean}                [force] Force l'arrêt même si l'option
 *                                         `keepalive` est activée ou si des
 *                                         navigateurs l'utilisent encore.
 */
const killLightpanda = (options, force = false) => {
    const key = JSON.stringify(options);
    const lightpanda = lightpandas.get(key);
    if (undefined !== lightpanda && (force || 0 === --lightpanda.count)) {
        lightpanda.process.kill();
        lightpandas.delete(key);
    }
};

/**
 * @typedef {Object} ToolsLightpandaOptions Les options du plugin
 *                                          `tools.lightpanda`.
 * @prop {LightpandaServeOptions} [serveOptions] Les options de la fonction
 *                                               `serve` de _lightpanda_.
 * @prop {boolean}                [keepalive]    La marque pour ne pas arrêter
 *                                               l'exécutable de _lightpanda_
 *                                               après la fermeture du
 *                                               navigateur.
 * @prop {AbortSignal}            [signal]       Le signal pour tuer
 *                                               l'exécutable de _lightpanda_.
 */

/**
 * Crée un plugin pour se connecter à Lightpanda.
 *
 * @param {ToolsLightpandaOptions} [options] Les éventuelles options du plugin
 *                                           `tools.lightpanda`.
 * @returns {Record<string, Function | Record<symbol, Record<string, Function>>>} Les
 *                                                                                crochets
 *                                                                                du
 *                                                                                plugin.
 * @see https://lightpanda.io/
 * @see https://www.npmjs.com/package/@lightpanda/browser
 */
export default function utilsLightpandaPlugin(options) {
    /**
     * Options de la fonction `serve` de _lightpanda_.
     *
     * @type {LightpandaServeOptions}
     */
    const serveOptions = {
        host: "127.0.0.1",
        port: 9222,
        ...options?.serveOptions,
    };

    /**
     * Marque pour ne pas arrêter l'exécutable de _lightpanda_ après la
     * fermeture du navigateur.
     *
     * @type {boolean}
     */
    const keepalive = options?.keepalive ?? false;

    if (undefined !== options?.signal) {
        // Écouter le signal pour tuer l'exécutable de lightpanda.
        options.signal.addEventListener("abort", () =>
            killLightpanda(serveOptions, true),
        );
    }

    return {
        /**
         * Modifie les options de connexion à un navigateur en utilisant le
         * _Chrome DevTools Protocol_ (_CDP_).
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {Promise<any[]>} Les nouveaux paramètres.
         */
        "BrowserType.connectOverCDP:before": async (args) => {
            return [await serveLightpanda(serveOptions, keepalive), args[1]];
        },

        /**
         * Arrête éventuellement l'exécutable de _lightpanda_ à la fermeture du
         * navigateur.
         *
         * @param {any} returnValue _Void_
         * @returns {any} _Void_
         */
        "Browser.close:after": (returnValue) => {
            killLightpanda(serveOptions);
            return returnValue;
        },

        Browser: {
            [Symbol.asyncDispose]: {
                /**
                 * Arrête éventuellement l'exécutable de _lightpanda_ à la
                 * fermeture automatique du navigateur.
                 *
                 * @param {any} returnValue _Void_
                 * @returns {any} _Void_
                 */
                after: (returnValue) => {
                    killLightpanda(serveOptions);
                    return returnValue;
                },
            },
        },
    };
}
