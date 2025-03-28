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
 * Initialise un plugin sauf s'il est désactivé.
 *
 * @param {Function}       plugin    La fonction pour créer le plugin.
 * @param {Object|boolean} [options] Les éventuelles options du plugin ; ou un
 *                                   booléen pour activer / déactiver le plugin.
 * @returns {Record<string, Function>} Les crochets des plugins ; ou un objet
 *                                     vide si le plugin est désactivé.
 */
const init = (plugin, options) => {
    return "boolean" === typeof options
        ? options
            ? plugin()
            : {}
        : plugin(options);
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
     * @param {Object}         [options]            Les éventuelles options des
     *                                              plugins de gommant les
     *                                              différences entre un
     *                                              navigateur utilisé par un
     *                                              être humain et un navigateur
     *                                              _headless_ contrôlé par un
     *                                              programme.
     * @param {boolean}        [options.automation] Un booléen pour activer /
     *                                              désactiver le plugin.
     * @param {boolean}        [options.headless]   Un booléen pour activer /
     *                                              désactiver le plugin.
     * @param {Object|boolean} [options.screen]     Les éventuelles options du
     *                                              plugin de la taille de
     *                                              l'écran ; ou un booléen pour
     *                                              activer / déactiver le
     *                                              plugin.
     * @param {Object|boolean} [options.viewport]   Les éventuelles options du
     *                                              plugin de la taille de la
     *                                              fenêtre du navigateur ; ou
     *                                              un booléen pour activer /
     *                                              désactiver le plugin.
     * @param {boolean}        [options.webdriver]  Un booléen pour activer /
     *                                              désactiver le plugin.
     * @returns {Record<string, Function>[]} Les crochets des plugins
     *                                       recommandés.
     */
    recommended: (options) => [
        init(automationPlugin, options?.automation),
        init(headlessPlugin, options?.headless),
        init(screenPlugin, options?.screen),
        init(viewportPlugin, options?.viewport),
        init(webdriverPlugin, options?.webdriver),
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
     * @param {Object}         [options]        Les éventuelles options des
     *                                          plugins humanisant recommandés.
     * @param {Object|boolean} [options.click]  Les éventuelles options du
     *                                          plugin des clics ; ou un booléen
     *                                          pour activer / désactiver le
     *                                          plugin.
     * @param {Object|boolean} [options.cursor] Les éventuelles options du
     *                                          plugin du curseur ; ou un
     *                                          booléen pour activer /
     *                                          désactiver le plugin.
     * @param {Object|boolean} [options.dialog] Les éventuelles options du
     *                                          plugin des boîtes de dialogues ;
     *                                          ou un booléen pour activer /
     *                                          désactiver le plugin.
     * @returns {Record<string, Function>[]} Les crochets des plugins
     *                                       recommandés.
     */
    recommended: (options) => [
        init(clickPlugin, options?.click),
        init(cursorPlugin, options?.cursor),
        init(dialogPlugin, options?.dialog),
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
     * @param {Object} [options]                   Les éventuelles options des
     *                                             plugins recommandés.
     * @param {Object} [options.polyfill]          Les éventuelles options des
     *                                             plugins de gommant les
     *                                             différences entre un
     *                                             navigateur utilisé par un
     *                                             être humain et un navigateur
     *                                             _headless_ contrôlé par un
     *                                             programme.
     * @param {Object} [options.polyfill.screen]   Les éventuelles options du
     *                                             plugin de la taille de
     *                                             l'écran.
     * @param {Object} [options.polyfill.viewport] Les éventuelles options du
     *                                             plugin de la taille de la
     *                                             fenêtre du navigateur.
     * @param {Object} [options.humanize]          Les éventuelles options des
     *                                             plugins humanisant.
     * @param {Object} [options.humanize.click]    Les éventuelles options du
     *                                             plugin des clics.
     * @param {Object} [options.humanize.cursor]   Les éventuelles options du
     *                                             plugin du curseur.
     * @param {Object} [options.humanize.dialog]   Les éventuelles options du
     *                                             plugin des boîtes de
     *                                             dialogues.
     * @returns {Record<string, Function>[]} Les crochets des plugins
     *                                       recommandés.
     */
    recommended: (options) => [
        ...polyfill.recommended(options?.polyfill),
        ...humanize.recommended(options?.humanize),
    ],
};
