/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { after, before, describe, it, mock } from "node:test";

describe("polyfills/map.js", () => {
    // @ts-expect-error -- getOrInsert n'est pas encore dans les types.
    const nativeGetOrInsert = Map.prototype.getOrInsert;
    // @ts-expect-error -- getOrInsertComputed n'est pas encore dans les types.
    const nativeGetOrInsertComputed = Map.prototype.getOrInsertComputed;

    before(async () => {
        // @ts-expect-error -- getOrInsert n'est pas encore dans les types.
        // biome-ignore lint/performance/noDelete: Supprimer la méthode pour les tests.
        delete Map.prototype.getOrInsert;
        // @ts-expect-error -- getOrInsertComputed n'est pas encore dans les
        //                     types.
        // biome-ignore lint/performance/noDelete: Supprimer la méthode pour les tests.
        delete Map.prototype.getOrInsertComputed;
        // Forcer la ré-importation du module des prothèses.
        await import(`../../../src/polyfills/map.js?${Date.now()}`);
    });

    after(() => {
        // @ts-expect-error -- getOrInsert n'est pas encore dans les types.
        // eslint-disable-next-line no-extend-native
        Map.prototype.getOrInsert = nativeGetOrInsert;
        // @ts-expect-error -- getOrInsertComputed n'est pas encore dans les
        //                     types.
        // eslint-disable-next-line no-extend-native
        Map.prototype.getOrInsertComputed = nativeGetOrInsertComputed;
    });

    describe("getOrInsert()", () => {
        it("should return existing value", () => {
            const map = new Map([["foo", "bar"]]);

            // @ts-expect-error -- getOrInsert n'est pas encore dans les types.
            const value = map.getOrInsert("foo", "baz");

            assert.equal(value, "bar");
            assert.equal(map.get("foo"), "bar");
        });

        it("should insert new value", () => {
            const map = new Map();

            // @ts-expect-error -- getOrInsert n'est pas encore dans les types.
            const value = map.getOrInsert("foo", "bar");

            assert.equal(value, "bar");
            assert.equal(map.get("foo"), "bar");
        });
    });

    describe("getOrInsertComputed()", () => {
        it("should return existing value", () => {
            const callback = mock.fn(() => "foo");
            const map = new Map([["bar", "baz"]]);

            // @ts-expect-error -- getOrInsertComputed n'est pas encore dans les
            //                     types.
            const value = map.getOrInsertComputed("bar", callback);

            assert.equal(value, "baz");
            assert.equal(map.get("bar"), "baz");

            assert.equal(callback.mock.callCount(), 0);
        });

        it("should insert new value", () => {
            const callback = mock.fn(() => "foo");
            const map = new Map();

            // @ts-expect-error -- getOrInsertComputed n'est pas encore dans les
            //                     types.
            const value = map.getOrInsertComputed("bar", callback);

            assert.equal(value, "foo");
            assert.equal(map.get("bar"), "foo");

            assert.equal(callback.mock.callCount(), 1);
        });
    });
});
