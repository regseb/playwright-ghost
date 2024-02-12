/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import hook from "../../src/hook.js";

const Foo = class {
    #bar;

    constructor(bar) {
        this.#bar = bar;
    }

    get bar() {
        return this.#bar;
    }

    set bar(value) {
        this.#bar = value;
    }

    baz(qux) {
        // Tester en utilisant la variable membre privée.
        return `${this.#bar}_${qux.toUpperCase()}`;
    }

    quux(corge, grault) {
        // Tester en utilisant le getter.
        return Promise.resolve(`${this.bar}_${corge}_${grault}`);
    }
};

describe("hook.js", function () {
    describe("hook()", function () {
        it("should do nothing with no listener", async function () {
            const listeners = new Map();
            const foo = new Foo("one");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "one");
            assert.equal(hooked.baz("two"), "one_TWO");
            assert.equal(await hooked.quux("three", "four"), "one_three_four");
        });

        it("should support listener before function", async function () {
            const listener = sinon.fake.returns(["one"]);
            const listeners = new Map([
                ["baz", { before: [listener], after: [] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "two");
            assert.equal(hooked.baz("three"), "two_ONE");
            assert.equal(await hooked.quux("four", "five"), "two_four_five");

            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                ["three"],
                { obj: hooked, prop: "baz", metadata: {} },
            ]);
        });

        it("should support listener after function", async function () {
            const listener = sinon.fake.returns("one");
            const listeners = new Map([
                ["baz", { before: [], after: [listener] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "two");
            assert.equal(hooked.baz("three"), "one");
            assert.equal(await hooked.quux("four", "five"), "two_four_five");

            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                "two_THREE",
                { obj: hooked, prop: "baz", args: ["three"], metadata: {} },
            ]);
        });

        it("should support listener before async function", async function () {
            const listener = sinon.fake.returns(["one", "two"]);
            const listeners = new Map([
                ["quux", { before: [listener], after: [] }],
            ]);
            const foo = new Foo("three");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "three");
            assert.equal(hooked.baz("four"), "three_FOUR");
            assert.equal(await hooked.quux("five", "six"), "three_one_two");

            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                ["five", "six"],
                { obj: hooked, prop: "quux", metadata: {} },
            ]);
        });

        it("should support listener after async function", async function () {
            const listener = sinon.fake.resolves("one");
            const listeners = new Map([
                ["quux", { before: [], after: [listener] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "two");
            assert.equal(hooked.baz("three"), "two_THREE");
            assert.equal(await hooked.quux("four", "five"), "one");

            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                Promise.resolve("two_four_five"),
                {
                    obj: hooked,
                    prop: "quux",
                    args: ["four", "five"],
                    metadata: {},
                },
            ]);
        });

        it("should support listener before getter", async function () {
            const listener = sinon.fake();
            const listeners = new Map([
                ["bar", { before: [listener], after: [] }],
            ]);
            const foo = new Foo("one");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "one");
            assert.equal(hooked.baz("two"), "one_TWO");
            assert.equal(await hooked.quux("three", "four"), "one_three_four");

            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                undefined,
                { obj: hooked, prop: "bar", metadata: {} },
            ]);
        });

        it("should support listener after getter", async function () {
            const listener = sinon.fake.returns("one");
            const listeners = new Map([
                ["bar", { before: [], after: [listener] }],
            ]);
            const foo = new Foo("two");

            const hooked = hook(foo, listeners);

            assert.equal(hooked.bar, "one");
            assert.equal(hooked.baz("three"), "two_THREE");
            assert.equal(await hooked.quux("four", "five"), "two_four_five");

            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                "two",
                { obj: hooked, prop: "bar", metadata: {} },
            ]);
        });
    });
});
