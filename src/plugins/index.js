/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import clickPlugin from "./humanize/click.js";
import cursorPlugin from "./humanize/cursor.js";
import dialogPlugin from "./humanize/dialog.js";
import automationPlugin from "./polyfill/automation.js";
import headlessPlugin from "./polyfill/headless.js";
import screenPlugin from "./polyfill/screen.js";
import userAgentPlugin from "./polyfill/useragent.js";
import viewportPlugin from "./polyfill/viewport.js";
import webdriverPlugin from "./polyfill/webdriver.js";
import webGLPlugin from "./polyfill/webgl.js";
import adblockerPlugin from "./utils/adblocker.js";
import debugPlugin from "./utils/debug.js";
import fingerprintPlugin from "./utils/fingerprint.js";
import localePlugin from "./utils/locale.js";
import xvfbPlugin from "./utils/xvfb.js";

/**
 * @import { ClickOptions } from "./humanize/click.js"
 * @import { CursorOptions } from "./humanize/cursor.js"
 * @import { DialogOptions } from "./humanize/dialog.js"
 * @import { ScreenOptions } from "./polyfill/screen.js"
 * @import { ViewportOptions } from "./polyfill/viewport.js"
 */

/**
 * @typedef {Object} PolyfillPluginsOptions Les options des plugins de gommant
 *                                          les différences entre un navigateur
 *                                          utilisé par un être humain et un
 *                                          navigateur _headless_ contrôlé par
 *                                          un programme.
 * @prop {boolean}                 [automation] Un booléen pour activer /
 *                                              désactiver le plugin.
 * @prop {boolean}                 [headless]   Un booléen pour activer /
 *                                              désactiver le plugin.
 * @prop {ScreenOptions|boolean}   [screen]     Les éventuelles options du
 *                                              plugin de la taille de
 *                                              l'écran ; ou un booléen pour
 *                                              activer / déactiver le
 *                                              plugin.
 * @prop {ViewportOptions|boolean} [viewport]   Les éventuelles options du
 *                                              plugin de la taille de la
 *                                              fenêtre du navigateur ; ou
 *                                              un booléen pour activer /
 *                                              désactiver le plugin.
 * @prop {boolean}                 [webdriver]  Un booléen pour activer /
 *                                              désactiver le plugin.
 */

/**
 * @typedef {Object} HumanizePluginsOptions Les éventuelles options des
 *                                          plugins humanisant recommandés.
 * @prop {ClickOptions|boolean}  [click]  Les éventuelles options du plugin des
 *                                        clics ; ou un booléen pour activer /
 *                                        désactiver le plugin.
 * @prop {CursorOptions|boolean} [cursor] Les éventuelles options du plugin du
 *                                        curseur ; ou un booléen pour activer /
 *                                        désactiver le plugin.
 * @prop {DialogOptions|boolean} [dialog] Les éventuelles options du plugin des
 *                                        boîtes de dialogues ; ou un booléen
 *                                        pour activer / désactiver le plugin.
 */

/**
 * Initialise un plugin sauf s'il est désactivé.
 *
 * @param {Function}       plugin    La fonction pour créer le plugin.
 * @param {Object|boolean} [options] Les éventuelles options du plugin ; ou un
 *                                   booléen pour activer / déactiver le plugin.
 * @returns {Record<string, Function>} Les crochets du plugin ; ou un objet vide
 *                                     si le plugin est désactivé.
 */
const initPlugin = (plugin, options) => {
    return "boolean" === typeof options
        ? options
            ? plugin()
            : {}
        : plugin(options);
};

/**
 * Initialise des plugins sauf s'ils sont désactivés.
 *
 * @param {Function}       plugins   La fonction pour créer les plugins.
 * @param {Object|boolean} [options] Les éventuelles options des plugins ; ou un
 *                                   booléen pour activer / déactiver les
 *                                   plugins.
 * @returns {Record<string, Function>[]} Les crochets des plugins ; ou une liste
 *                                       vide si les plugins sont désactivés.
 */
const initPlugins = (plugins, options) => {
    return "boolean" === typeof options
        ? options
            ? plugins()
            : []
        : plugins(options);
};

/**
 * Les plugins pour gommer des différences entre un navigateur utilisé par un
 * être humain et un navigateur _headless_ contrôlé par un programme.
 */
const polyfill = {
    automation: automationPlugin,
    headless: headlessPlugin,
    screen: screenPlugin,
    userAgent: userAgentPlugin,
    viewport: viewportPlugin,
    webdriver: webdriverPlugin,
    webGL: webGLPlugin,

    /**
     * Crée les plugins recommandés qui gomment les différences entre un
     * navigateur utilisé par un être humain et un navigateur _headless_
     * contrôlé par un programme.
     *
     * @param {PolyfillPluginsOptions} [options] Les éventuelles options des
     *                                           plugins de gommant les
     *                                           différences entre un navigateur
     *                                           utilisé par un être humain et
     *                                           un navigateur _headless_
     *                                           contrôlé par un programme.
     * @returns {Record<string, Function>[]} Les crochets des plugins
     *                                       recommandés.
     */
    recommended: (options) => [
        initPlugin(automationPlugin, options?.automation),
        initPlugin(headlessPlugin, options?.headless),
        initPlugin(screenPlugin, options?.screen),
        initPlugin(viewportPlugin, options?.viewport),
        initPlugin(webdriverPlugin, options?.webdriver),
    ],
};

/**
 * Les plugins pour humaniser les actions.
 */
const humanize = {
    click: clickPlugin,
    cursor: cursorPlugin,
    dialog: dialogPlugin,

    /**
     * Crée les plugins recommandés humanisant.
     *
     * @param {HumanizePluginsOptions} [options] Les éventuelles options des
     *                                           plugins humanisant recommandés.
     * @returns {Record<string, Function>[]} Les crochets des plugins
     *                                       recommandés.
     */
    recommended: (options) => [
        initPlugin(clickPlugin, options?.click),
        initPlugin(cursorPlugin, options?.cursor),
        initPlugin(dialogPlugin, options?.dialog),
    ],
};

/**
 * Les plugins utilitaires.
 */
const utils = {
    adblocker: adblockerPlugin,
    debug: debugPlugin,
    fingerprint: fingerprintPlugin,
    locale: localePlugin,
    xvfb: xvfbPlugin,
};

/**
 * La liste de tous les plugins regroupés par catégorie.
 */
export default {
    polyfill,
    humanize,
    utils,

    /**
     * Crée les plugins recommandés.
     *
     * @param {Object}                         [options]          Les
     *                                                            éventuelles
     *                                                            options des
     *                                                            plugins
     *                                                            recommandés.
     * @param {PolyfillPluginsOptions|boolean} [options.polyfill] Les
     *                                                            éventuelles
     *                                                            options des
     *                                                            plugins
     *                                                            gommant les
     *                                                            différences
     *                                                            entre un
     *                                                            navigateur
     *                                                            utilisé par un
     *                                                            être humain et
     *                                                            un navigateur
     *                                                            _headless_
     *                                                            contrôlé par
     *                                                            un programme ;
     *                                                            ou un booléen
     *                                                            pour activer /
     *                                                            désactiver les
     *                                                            plugins
     *                                                            _polyfill_.
     * @param {HumanizePluginsOptions|boolean} [options.humanize] Les
     *                                                            éventuelles
     *                                                            options des
     *                                                            plugins
     *                                                            humanisant ;
     *                                                            ou un booléen
     *                                                            pour activer /
     *                                                            désactiver le
     *                                                            plugin.
     * @returns {Record<string, Function>[]} Les crochets des plugins
     *                                       recommandés.
     */
    recommended: (options) => [
        ...initPlugins(polyfill.recommended, options?.polyfill),
        ...initPlugins(humanize.recommended, options?.humanize),
    ],
};
