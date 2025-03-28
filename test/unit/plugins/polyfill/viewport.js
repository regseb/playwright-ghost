/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import crypto from "node:crypto";
import { mock } from "node:test";
import viewportPlugin from "../../../../src/plugins/polyfill/viewport.js";

describe("plugins/polyfill/viewport.js", function () {
    describe("viewportPlugin()", function () {
        describe("BrowserType.launchPersistentContext:before", function () {
            afterEach(function () {
                mock.reset();
            });

            it("should support no option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"]);

                assert.deepEqual(args, [
                    "./foo/",
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support empty option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin({});
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"]);

                assert.deepEqual(args, [
                    "./foo/",
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { slowMo: 200 }]);

                assert.deepEqual(args, [
                    "./foo/",
                    { slowMo: 200, viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support 'viewport' option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 0);

                const plugin = viewportPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener([
                    "./foo/",
                    { viewport: { width: 1600, height: 700 } },
                ]);

                assert.deepEqual(args, [
                    "./foo/",
                    { viewport: { width: 1600, height: 700 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support options", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 350;
                        case 1:
                            return 150;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin({
                    width: { min: 300, max: 400 },
                    height: { min: 100, max: 200 },
                });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"]);

                assert.deepEqual(args, [
                    "./foo/",
                    { viewport: { width: 350, height: 150 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [300, 401]);
                assert.deepEqual(randomInt.mock.calls[1].arguments, [100, 201]);
            });
        });

        describe("Browser.newContext:before", function () {
            afterEach(function () {
                mock.reset();
            });

            it("should support no option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support empty option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin({});
                const listener = plugin["Browser.newContext:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([{ slowMo: 200 }]);

                assert.deepEqual(args, [
                    { slowMo: 200, viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support 'viewport' option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 0);

                const plugin = viewportPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([
                    { viewport: { width: 1600, height: 700 } },
                ]);

                assert.deepEqual(args, [
                    { viewport: { width: 1600, height: 700 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support options", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 350;
                        case 1:
                            return 150;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin({
                    width: { min: 300, max: 400 },
                    height: { min: 100, max: 200 },
                });
                const listener = plugin["Browser.newContext:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 350, height: 150 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [300, 401]);
                assert.deepEqual(randomInt.mock.calls[1].arguments, [100, 201]);
            });
        });

        describe("Browser.newPage:before", function () {
            afterEach(function () {
                mock.reset();
            });

            it("should support no option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support empty option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin({});
                const listener = plugin["Browser.newPage:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([{ slowMo: 200 }]);

                assert.deepEqual(args, [
                    { slowMo: 200, viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support 'viewport' option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 0);

                const plugin = viewportPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([
                    { viewport: { width: 1600, height: 700 } },
                ]);

                assert.deepEqual(args, [
                    { viewport: { width: 1600, height: 700 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1801],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 801]);
            });

            it("should support options", function () {
                const randomInt = mock.method(crypto, "randomInt", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 350;
                        case 1:
                            return 150;
                        default:
                            return 0;
                    }
                });

                const plugin = viewportPlugin({
                    width: { min: 300, max: 400 },
                    height: { min: 100, max: 200 },
                });
                const listener = plugin["Browser.newPage:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 350, height: 150 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [300, 401]);
                assert.deepEqual(randomInt.mock.calls[1].arguments, [100, 201]);
            });
        });
    });
});
