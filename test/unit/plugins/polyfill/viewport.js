/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import polyfillViewportPlugin from "../../../../src/plugins/polyfill/viewport.js";
import Random from "../../../../src/utils/random.js";

describe("plugins/polyfill/viewport.js", () => {
    describe("polyfillViewportPlugin()", () => {
        describe("BrowserType.launchPersistentContext:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin();
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
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin({});
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
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin();
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
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support 'viewport' option", () => {
                const randomInt = mock.method(Random, "int", () => 0);

                const plugin = polyfillViewportPlugin();
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
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support options", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 350;
                        case 1:
                            return 150;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin({
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
                assert.deepEqual(randomInt.mock.calls[0].arguments, [300, 400]);
                assert.deepEqual(randomInt.mock.calls[1].arguments, [100, 200]);
            });
        });

        describe("Browser.newContext:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin({});
                const listener = plugin["Browser.newContext:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([{ slowMo: 200 }]);

                assert.deepEqual(args, [
                    { slowMo: 200, viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support 'viewport' option", () => {
                const randomInt = mock.method(Random, "int", () => 0);

                const plugin = polyfillViewportPlugin();
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
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support options", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 350;
                        case 1:
                            return 150;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin({
                    width: { min: 300, max: 400 },
                    height: { min: 100, max: 200 },
                });
                const listener = plugin["Browser.newContext:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 350, height: 150 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [300, 400]);
                assert.deepEqual(randomInt.mock.calls[1].arguments, [100, 200]);
            });
        });

        describe("Browser.newPage:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin({});
                const listener = plugin["Browser.newPage:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 1500;
                        case 1:
                            return 600;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([{ slowMo: 200 }]);

                assert.deepEqual(args, [
                    { slowMo: 200, viewport: { width: 1500, height: 600 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(
                    randomInt.mock.calls[0].arguments,
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support 'viewport' option", () => {
                const randomInt = mock.method(Random, "int", () => 0);

                const plugin = polyfillViewportPlugin();
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
                    [1000, 1800],
                );
                assert.deepEqual(randomInt.mock.calls[1].arguments, [500, 800]);
            });

            it("should support options", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 350;
                        case 1:
                            return 150;
                        default:
                            return 0;
                    }
                });

                const plugin = polyfillViewportPlugin({
                    width: { min: 300, max: 400 },
                    height: { min: 100, max: 200 },
                });
                const listener = plugin["Browser.newPage:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { viewport: { width: 350, height: 150 } },
                ]);

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [300, 400]);
                assert.deepEqual(randomInt.mock.calls[1].arguments, [100, 200]);
            });
        });
    });
});
