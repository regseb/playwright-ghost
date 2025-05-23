/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import hook from "../../src/hook.js";

const Foo = class {
    #bar;

    constructor(/** @type {string} */ bar) {
        this.#bar = bar;
    }

    get bar() {
        return this.#bar;
    }

    set bar(/** @type {string} */ value) {
        this.#bar = value;
    }

    baz(/** @type {string} */ qux) {
        // Tester en utilisant la variable membre privée.
        return `${this.#bar}_${qux.toUpperCase()}`;
    }

    quux(/** @type {string} */ corge, /** @type {string} */ grault) {
        // Tester en utilisant le getter.
        return Promise.resolve(`${this.bar}_${corge}_${grault}`);
    }
};

describe("hook.js", () => {
    describe("hook()", () => {
        it("should do nothing with no listener", async () => {
            const listeners = new Map();
            const foo = new Foo("one");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "one");
            assert.equal(hooked.baz("two"), "one_TWO");
            assert.equal(await hooked.quux("three", "four"), "one_three_four");
        });

        it("should support listener before function", async () => {
            const listener = mock.fn(() => ["one"]);
            const listeners = new Map([
                ["baz", { before: [listener], after: [] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "two");
            assert.equal(hooked.baz("three"), "two_ONE");
            assert.equal(await hooked.quux("four", "five"), "two_four_five");

            assert.equal(listener.mock.callCount(), 1);
            assert.equal(listener.mock.calls[0].arguments.length, 2);
            assert.deepEqual(listener.mock.calls[0].arguments[0], ["three"]);
            assert.equal(listener.mock.calls[0].arguments[1].obj, hooked);
            assert.equal(listener.mock.calls[0].arguments[1].prop, "baz");
        });

        it("should support listener after function", async () => {
            const listener = mock.fn(() => "one");
            const listeners = new Map([
                ["baz", { before: [], after: [listener] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "two");
            assert.equal(hooked.baz("three"), "one");
            assert.equal(await hooked.quux("four", "five"), "two_four_five");

            assert.equal(listener.mock.callCount(), 1);
            assert.equal(listener.mock.calls[0].arguments.length, 2);
            assert.equal(listener.mock.calls[0].arguments[0], "two_THREE");
            assert.equal(listener.mock.calls[0].arguments[1].obj, hooked);
            assert.equal(listener.mock.calls[0].arguments[1].prop, "baz");
            assert.deepEqual(listener.mock.calls[0].arguments[1].args, [
                "three",
            ]);
        });

        it("should support listener before async function", async () => {
            const listener = mock.fn(() => ["one", "two"]);
            const listeners = new Map([
                ["quux", { before: [listener], after: [] }],
            ]);
            const foo = new Foo("three");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "three");
            assert.equal(hooked.baz("four"), "three_FOUR");
            assert.equal(await hooked.quux("five", "six"), "three_one_two");

            assert.equal(listener.mock.callCount(), 1);
            assert.equal(listener.mock.calls[0].arguments.length, 2);
            assert.deepEqual(listener.mock.calls[0].arguments[0], [
                "five",
                "six",
            ]);
            assert.equal(listener.mock.calls[0].arguments[1].obj, hooked);
            assert.equal(listener.mock.calls[0].arguments[1].prop, "quux");
        });

        it("should support listener async before function", async () => {
            const listener = mock.fn(() => Promise.resolve(["one", "two"]));
            const listeners = new Map([
                ["quux", { before: [listener], after: [] }],
            ]);
            const foo = new Foo("three");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "three");
            assert.equal(hooked.baz("four"), "three_FOUR");
            assert.equal(await hooked.quux("five", "six"), "three_one_two");

            assert.equal(listener.mock.callCount(), 1);
            assert.equal(listener.mock.calls[0].arguments.length, 2);
            assert.deepEqual(listener.mock.calls[0].arguments[0], [
                "five",
                "six",
            ]);
            assert.equal(listener.mock.calls[0].arguments[1].obj, hooked);
            assert.equal(listener.mock.calls[0].arguments[1].prop, "quux");
        });

        it("should support listener after async function", async () => {
            const listener = mock.fn(() => "one");
            const listeners = new Map([
                ["quux", { before: [], after: [listener] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "two");
            assert.equal(hooked.baz("three"), "two_THREE");
            assert.equal(await hooked.quux("four", "five"), "one");

            assert.equal(listener.mock.callCount(), 1);
            assert.equal(listener.mock.calls[0].arguments.length, 2);
            assert.equal(listener.mock.calls[0].arguments[0], "two_four_five");
            assert.equal(listener.mock.calls[0].arguments[1].obj, hooked);
            assert.equal(listener.mock.calls[0].arguments[1].prop, "quux");
            assert.deepEqual(listener.mock.calls[0].arguments[1].args, [
                "four",
                "five",
            ]);
        });

        it("should support listener async after function", async () => {
            const listener = mock.fn(() => Promise.resolve("one"));
            const listeners = new Map([
                ["quux", { before: [], after: [listener] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "two");
            assert.equal(hooked.baz("three"), "two_THREE");
            assert.equal(await hooked.quux("four", "five"), "one");

            assert.equal(listener.mock.callCount(), 1);
            assert.equal(listener.mock.calls[0].arguments.length, 2);
            assert.equal(listener.mock.calls[0].arguments[0], "two_four_five");
            assert.equal(listener.mock.calls[0].arguments[1].obj, hooked);
            assert.equal(listener.mock.calls[0].arguments[1].prop, "quux");
            assert.deepEqual(listener.mock.calls[0].arguments[1].args, [
                "four",
                "five",
            ]);
        });

        it("should support listener before getter", async () => {
            const listener = mock.fn();
            const listeners = new Map([
                ["bar", { before: [listener], after: [] }],
            ]);
            const foo = new Foo("one");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "one");
            assert.equal(hooked.baz("two"), "one_TWO");
            assert.equal(await hooked.quux("three", "four"), "one_three_four");

            assert.equal(listener.mock.callCount(), 1);
            assert.equal(listener.mock.calls[0].arguments.length, 2);
            assert.equal(listener.mock.calls[0].arguments[0], undefined);
            assert.equal(listener.mock.calls[0].arguments[1].obj, hooked);
            assert.equal(listener.mock.calls[0].arguments[1].prop, "bar");
        });

        it("should support listener after getter", async () => {
            const listener = mock.fn(() => "one");
            const listeners = new Map([
                ["bar", { before: [], after: [listener] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "one");
            assert.equal(hooked.baz("three"), "two_THREE");
            assert.equal(await hooked.quux("four", "five"), "two_four_five");

            assert.equal(listener.mock.callCount(), 1);
            assert.equal(listener.mock.calls[0].arguments.length, 2);
            assert.equal(listener.mock.calls[0].arguments[0], "two");
            assert.equal(listener.mock.calls[0].arguments[1].obj, hooked);
            assert.equal(listener.mock.calls[0].arguments[1].prop, "bar");
            assert.equal(listener.mock.calls[0].arguments[1].args, undefined);
        });
    });
});
