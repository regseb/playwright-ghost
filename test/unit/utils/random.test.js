/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import crypto from "node:crypto";
import { afterEach, describe, it, mock } from "node:test";
import Random from "../../../src/utils/random.js";

describe("utils/random.js", () => {
    describe("Random", () => {
        afterEach(() => {
            mock.reset();
        });

        describe("random()", () => {
            it("should return a number between 0 and 1 (exclusive)", () => {
                const result = Random.random();
                assert.ok(0 <= result && 1 > result, `0 <= ${result} < 1`);
            });
        });

        describe("number()", () => {
            it("should return a number between 'lo' and hi (exclusive)", () => {
                const result = Random.number(42, 69);
                assert.ok(42 <= result && 69 > result, `42 <= ${result} < 69`);
            });

            it("should return lower number", () => {
                const random = mock.method(Math, "random", () => 0);

                const result = Random.number(1984, 1998);
                assert.equal(result, 1984);

                assert.equal(random.mock.callCount(), 1);
            });

            it("should return upper number", () => {
                const random = mock.method(Math, "random", () => 0.99);

                const result = Random.number(1984, 1998);
                assert.equal(result, 1997.86);

                assert.equal(random.mock.callCount(), 1);
            });
        });

        describe("int()", () => {
            it("should return a number between 'lo' and hi (exclusive)", () => {
                const result = Random.int(42, 69);
                assert.ok(
                    42 <= result && 69 >= result,
                    `42 <= ${result} <= 69`,
                );
            });

            it("should return a number", () => {
                const result = Random.int(100, 100);
                assert.equal(result, 100);
            });

            it("should return lower number", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 1984);

                const result = Random.int(1984, 1998);
                assert.equal(result, 1984);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1984, 1999],
                );
            });

            it("should return upper number", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 1998);

                const result = Random.int(1984, 1998);
                assert.equal(result, 1998);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1984, 1999],
                );
            });
        });
    });
});
