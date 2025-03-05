/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import crypto from "node:crypto";
import timers from "node:timers/promises";
import ghostCursor from "ghost-cursor";

/**
 * @import { Locator, Mouse, Page } from "playwright"
 * @import { ContextBefore } from "../../hook.js"
 */

/**
 * Le symbole pour stocker la position du curseur dans la Page.
 *
 * @type {symbol}
 */
const SYMBOL = Symbol("cursor");

/**
 * Déplace le curseur.
 *
 * @param {Object} to    Les coordonnées où déplacer le curseur.
 * @param {number} to.x  La coordonnées _x_ où déplacer le curseur.
 * @param {number} to.y  La coordonnées _y_ où déplacer le curseur.
 * @param {Mouse}  mouse Le curseur de la page.
 */
const move = async (to, mouse) => {
    // Vérifier que le curseur n'est pas déjà à la position demandée.
    // https://github.com/Xetera/ghost-cursor/issues/159
    if (mouse[SYMBOL].x === to.x && mouse[SYMBOL].y === to.y) {
        return;
    }

    const path = ghostCursor.path(mouse[SYMBOL], to, { useTimestamps: true });

    // Déplacer le curseur.
    for (const step of path) {
        // Forcer le nombre d'étapes à 1 pour utiliser la méthode native de
        // déplacement.
        await mouse.move(step.x, step.y, { steps: 1 });
        await timers.setTimeout(step.timestamp - Date.now());
    }

    // Enregistrer la nouvelle position du curseur, pour l'utiliser comme point
    // de départ lors du prochain déplacement.
    // eslint-disable-next-line no-param-reassign
    mouse[SYMBOL] = to;
};

/**
 * Déplace le curseur avant d'effectuer une action (par exemple cliquer).
 *
 * @param {Object}  options Les options de l'action.
 * @param {Locator} locator Le `Locator` de l'élément où l'action sera
 *                          effectuée.
 * @returns {Promise<Object>} Les nouvelles options de l'action.
 */
const moveCursor = async (options, locator) => {
    // Déterminer où cliquer dans l'élément.
    const box = await locator.boundingBox();
    const position = {
        x: options?.position?.x ?? crypto.randomInt(0, Math.trunc(box.width)),
        y: options?.position?.y ?? crypto.randomInt(0, Math.trunc(box.height)),
    };

    // Calculer le chemin entre la position actuelle du curseur et l'élément.
    const to = {
        x: box.x + position.x,
        y: box.y + position.y,
    };

    await move(to, locator.page().mouse);

    return {
        ...options,
        position,
    };
};

/**
 * Crée un plugin pour déplacer le curseur en imitant les mouvements d'un être
 * humain.
 *
 * @param {Object} [options]         Les options du plugin.
 * @param {Object} [options.start]   Le position de départ du curseur.
 * @param {number} [options.start.x] Le position _x_ de départ du curseur.
 * @param {number} [options.start.y] Le position _y_ de départ du curseur.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function cursorPlugin(options) {
    const start = {
        x: options?.start?.x ?? 0,
        y: options?.start?.y ?? 0,
    };

    return {
        /**
         * Ajoute la position du curseur à la page.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Page} La page avec la position du curseur.
         */
        "Page:new": (page) => {
            // eslint-disable-next-line no-param-reassign
            page.mouse[SYMBOL] = start;
            return page;
        },

        /**
         * Déplace le curseur avant de cocher une case.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Locator>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "Locator.check:before": async (args, { obj: locator }) => {
            if (args[0]?.trial) {
                return args;
            }
            await locator.check({ ...args[0], trial: true });
            return [await moveCursor(args[0], locator)];
        },

        /**
         * Déplace le curseur avant de cliquer.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Locator>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "Locator.click:before": async (args, { obj: locator }) => {
            if (args[0]?.trial) {
                return args;
            }
            await locator.click({ ...args[0], trial: true });
            return [await moveCursor(args[0], locator)];
        },

        /**
         * Déplace le curseur avant de double-cliquer.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Locator>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "Locator.dblclick:before": async (args, { obj: locator }) => {
            if (args[0]?.trial) {
                return args;
            }
            await locator.dbclick({ ...args[0], trial: true });
            return [await moveCursor(args[0], locator)];
        },

        /**
         * Déplace le curseur pour survoler un élément.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Locator>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "Locator.hover:before": async (args, { obj: locator }) => {
            if (args[0]?.trial) {
                return args;
            }
            await locator.hover({ ...args[0], trial: true });
            return [await moveCursor(args[0], locator)];
        },

        /**
         * Déplace le curseur avant de modifier l'état d'une case à cocher.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Locator>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "Locator.setChecked:before": async (args, { obj: locator }) => {
            if (args[1]?.trial) {
                return args;
            }
            await locator.setChecked(args[0], { ...args[1], trial: true });
            return [args[0], await moveCursor(args[1], locator)];
        },

        /**
         * Déplace le curseur avant de décocher une case.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Locator>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les nouveaux
         *                           paramètres.
         */
        "Locator.uncheck:before": async (args, { obj: locator }) => {
            if (args[0]?.trial) {
                return args;
            }
            await locator.uncheck({ ...args[0], trial: true });
            return [await moveCursor(args[0], locator)];
        },

        /**
         * Déplace le curseur avant de cliquer à des coordonnées.
         *
         * @param {any[]}                args    Les paramètres de la méthode.
         * @param {ContextBefore<Mouse>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les paramètres.
         */
        "Mouse.click:before": async (args, { obj: mouse }) => {
            if (undefined === args[2]?.steps) {
                await move({ x: args[0], y: args[1] }, mouse);
            }
            return args;
        },

        /**
         * Déplace le curseur avant de double-cliquer à des coordonnées.
         *
         * @param {any[]}                args    Les paramètres de la méthode.
         * @param {ContextBefore<Mouse>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les paramètres.
         */
        "Mouse.dblclick:before": async (args, { obj: mouse }) => {
            if (undefined === args[2]?.steps) {
                await move({ x: args[0], y: args[1] }, mouse);
            }
            return args;
        },

        /**
         * Déplace le curseur à des coordonnées.
         *
         * @param {any[]}                args    Les paramètres de la méthode.
         * @param {ContextBefore<Mouse>} context Le contexte du crochet.
         * @returns {Promise<any[]>} Une promesse contenant les paramètres.
         */
        "Mouse.move:before": async (args, { obj: mouse }) => {
            if (undefined === args[2]?.steps) {
                await move({ x: args[0], y: args[1] }, mouse);
            }
            return args;
        },
    };
}
