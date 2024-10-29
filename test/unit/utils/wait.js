/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import wait from "../../../src/utils/wait.js";

/**
 * Passe au prochain cycle de la boucle d'événements.
 *
 * @returns {Promise<void>} Une promesse résolue au prochain cycle.
 */
const nextEventLoopTick = () => {
    return new Promise((resolve) => {
        queueMicrotask(resolve);
    });
};

describe("utils/wait.js", function () {
    describe("wait()", function () {
        afterEach(function () {
            mock.reset();
        });

        it("should wait", async function () {
            const fn = mock.fn();
            mock.timers.enable({ apis: ["setTimeout"] });

            queueMicrotask(async () => {
                await wait(42);
                fn();
            });
            // Passer au prochain cycle pour laisser la micro-tâche s'exécuter.
            await nextEventLoopTick();

            mock.timers.tick(41);
            // Passer au prochain cycle pour laisser la fonction, après le wait
            // de 42 ms, s'exécuter (ici ce n'est pas le cas car le temps
            // d'attente de 41 ms est trop court).
            await nextEventLoopTick();
            assert.equal(fn.mock.callCount(), 0);

            mock.timers.tick(1);
            // Passer au prochain cycle pour laisser la fonction après le wait
            // s'exécuter.
            await nextEventLoopTick();
            assert.equal(fn.mock.callCount(), 1);
        });
    });
});
