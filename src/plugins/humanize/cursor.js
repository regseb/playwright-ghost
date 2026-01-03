/**
 * @module
 * @license MIT
 * @see https://github.com/Xetera/ghost-cursor
 * @author Sébastien Règne
 */

import timers from "node:timers/promises";
import ghostCursor from "ghost-cursor";
import Random from "../../utils/random.js";

/**
 * @import { Locator, Mouse, Page } from "playwright"
 * @import { ContextBefore } from "../../hook.js"
 */

/**
 * Le symbole pour stocker la position du curseur dans la souris.
 *
 * @type {symbol}
 */
const CURSOR_SYMBOL = Symbol("cursor");

/**
 * Déplace le curseur à une position.
 *
 * @param {Object} to    La position où déplacer le curseur.
 * @param {number} to.x  La position _x_ où déplacer le curseur.
 * @param {number} to.y  La position _y_ où déplacer le curseur.
 * @param {Mouse}  mouse La souris de la page.
 */
const moveToPosition = async (to, mouse) => {
    // Vérifier que le curseur n'est pas déjà à la position demandée.
    // https://github.com/Xetera/ghost-cursor/issues/159
    if (mouse[CURSOR_SYMBOL].x === to.x && mouse[CURSOR_SYMBOL].y === to.y) {
        return;
    }

    const steps = ghostCursor
        .path(mouse[CURSOR_SYMBOL], to, { useTimestamps: true })
        // Arrondir les positions pour avoir des nombres entiers, car les
        // positions de la souris (et les paramètres de la méthode
        // Locator.move()) sont des entiers.
        .map((point) => ({
            ...point,
            x: Math.round(point.x),
            y: Math.round(point.y),
        }))
        // Enlever les positions en double (pour ne pas émettre deux évènements
        // avec la même position). Cela peut arriver avec des petits
        // déplacements et valeurs arrondies.
        .filter(
            (point, index, path) =>
                path.findIndex((p) => point.x === p.x && point.y === p.y) ===
                index,
        )
        // Convertir les horodatages en délai, car selon le temps d'exécution :
        // l'horodatage peut être dans le passé.
        .map((point, index, path) => ({
            x: point.x,
            y: point.y,
            delay:
                0 === index ? 0 : point.timestamp - path[index - 1].timestamp,
        }));

    // Déplacer le curseur. Enlever le premier et le dernier élément du chemin
    // qui sont la position actuelle et la position finale du curseur.
    for (const step of steps.slice(1, -1)) {
        // Forcer le nombre d'étapes à 1 pour utiliser la méthode native de
        // déplacement.
        await mouse.move(step.x, step.y, { steps: 1 });
        await timers.setTimeout(step.delay);
    }

    // Enregistrer la nouvelle position du curseur, pour l'utiliser comme point
    // de départ lors du prochain déplacement.
    // eslint-disable-next-line no-param-reassign
    mouse[CURSOR_SYMBOL] = to;
};

/**
 * Déplace le curseur sur un élément.
 *
 * @param {Locator} locator            Le `Locator` de l'élément.
 * @param {Object}  [options]          Les options de l'action.
 * @param {Object}  [options.position] La position où faire l'action.
 * @param {number}  options.position.x La position _x_ où faire l'action.
 * @param {number}  options.position.y La position _y_ où faire l'action.
 * @returns {Promise<Object>} Les nouvelles options de l'action (avec la
 *                            position où faire l'action).
 */
const movetoLocator = async (locator, options) => {
    const box = await locator.boundingBox();
    // Déterminer où cliquer dans l'élément. Trouver un point aléatoire dans
    // l'ellipse (délimitée par le rectangle de l'élément) en favorisant les
    // points proches du centre (ce n'est pas la racine carrée de rho qui est
    // utilisée contrairement à la réponse :
    // https://stackoverflow.com/a/5529199).
    const phi = Random.number(0, 2 * Math.PI);
    const rho = Random.random();
    const position = options?.position ?? {
        x: (rho * Math.cos(phi) * box.width) / 2 + box.width / 2,
        y: (rho * Math.sin(phi) * box.height) / 2 + box.height / 2,
    };
    const to = {
        x: box.x + position.x,
        y: box.y + position.y,
    };

    // Déplacer le curseur entre la position actuelle et le point dans
    // l'élément.
    await moveToPosition(to, locator.page().mouse);

    return {
        ...options,
        position,
    };
};

/**
 * @typedef {Object} HumanizeCursorOptions Les options du plugin
 *                                         `humanize.cursor`.
 * @prop {Object} [start]   La position de départ du curseur.
 * @prop {number} [start.x] La position _x_ de départ du curseur.
 * @prop {number} [start.y] La position _y_ de départ du curseur.
 */

/**
 * Crée un plugin pour déplacer le curseur en imitant les mouvements d'un être
 * humain.
 *
 * @param {HumanizeCursorOptions} [options] Les éventuelles options du plugin
 *                                          `humanize.cursor`.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function humanizeCursorPlugin(options) {
    const start = {
        x: options?.start?.x,
        y: options?.start?.y,
    };

    return {
        /**
         * Ajoute la position du curseur à la souris.
         *
         * @param {Page} page La page nouvellement créée avec sa souris.
         * @returns {Page} La page avec la position du curseur.
         */
        "Page:new": (page) => {
            const viewportSize = page.viewportSize();
            // eslint-disable-next-line no-param-reassign
            page.mouse[CURSOR_SYMBOL] = {
                x: start.x ?? Random.int(0, viewportSize?.width ?? 0),
                y: start.y ?? Random.int(0, viewportSize?.height ?? 0),
            };
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
            return [await movetoLocator(locator, args[0])];
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
            if (args[0]?.trial || undefined !== args[0]?.steps) {
                return args;
            }
            await locator.click({ ...args[0], trial: true });
            return [await movetoLocator(locator, args[0])];
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
            if (args[0]?.trial || undefined !== args[0]?.steps) {
                return args;
            }
            await locator.dblclick({ ...args[0], trial: true });
            return [await movetoLocator(locator, args[0])];
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
            return [await movetoLocator(locator, args[0])];
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
            return [args[0], await movetoLocator(locator, args[1])];
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
            return [await movetoLocator(locator, args[0])];
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
                await moveToPosition({ x: args[0], y: args[1] }, mouse);
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
                await moveToPosition({ x: args[0], y: args[1] }, mouse);
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
                await moveToPosition({ x: args[0], y: args[1] }, mouse);
            }
            return args;
        },
    };
}
