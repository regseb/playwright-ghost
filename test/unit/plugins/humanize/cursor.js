/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import humanizeCursorPlugin from "../../../../src/plugins/humanize/cursor.js";
import Random from "../../../../src/utils/random.js";

const LocatorMock = class {
    check = mock.fn();
    click = mock.fn();
    dblclick = mock.fn();
    hover = mock.fn();
    setChecked = mock.fn();
    uncheck = mock.fn();
};

const MouseMock = class {
    move = mock.fn();
};

describe("plugins/humanize/cursor.js", () => {
    describe("humanizeCursorPlugin()", () => {
        describe("Page:new", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 200;
                        case 1:
                            return 300;
                        default:
                            return 0;
                    }
                });

                const page = {
                    viewportSize: () => ({ width: 123, height: 456 }),
                    mouse: {},
                };

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
                const symbols = Object.getOwnPropertySymbols(page.mouse);
                assert.equal(symbols.length, 1);
                const start = page.mouse[symbols[0]];
                assert.deepEqual(start, { x: 200, y: 300 });

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [0, 123]);
                assert.deepEqual(randomInt.mock.calls[1].arguments, [0, 456]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(Random, "int", () => {
                    switch (randomInt.mock.callCount()) {
                        case 0:
                            return 200;
                        case 1:
                            return 300;
                        default:
                            return 0;
                    }
                });

                const page = {
                    viewportSize: () => ({ width: 123, height: 456 }),
                    mouse: {},
                };

                const plugin = humanizeCursorPlugin({});
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
                const symbols = Object.getOwnPropertySymbols(page.mouse);
                assert.equal(symbols.length, 1);
                const start = page.mouse[symbols[0]];
                assert.deepEqual(start, { x: 200, y: 300 });

                assert.equal(randomInt.mock.callCount(), 2);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [0, 123]);
                assert.deepEqual(randomInt.mock.calls[1].arguments, [0, 456]);
            });

            it("should support option", () => {
                const randomInt = mock.method(Random, "int");

                const page = {
                    viewportSize: () => ({ width: 123, height: 456 }),
                    mouse: {},
                };

                const plugin = humanizeCursorPlugin({
                    start: { x: 42, y: 43 },
                });
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);

                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
                const symbols = Object.getOwnPropertySymbols(page.mouse);
                assert.equal(symbols.length, 1);
                const start = page.mouse[symbols[0]];
                assert.deepEqual(start, { x: 42, y: 43 });

                assert.equal(randomInt.mock.callCount(), 0);
            });
        });

        describe("Locator.check:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Locator.check:before"];
                const argsAltered = await listener([{ trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ trial: true }]);
                assert.equal(locator.check.mock.callCount(), 0);
            });
        });

        describe("Locator.click:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Locator.click:before"];
                const argsAltered = await listener([{ trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ trial: true }]);
                assert.equal(locator.click.mock.callCount(), 0);
            });

            it("should do nothing when 'steps'", async () => {
                const locator = new LocatorMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Locator.click:before"];
                const argsAltered = await listener([{ steps: 42 }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ steps: 42 }]);
                assert.equal(locator.click.mock.callCount(), 0);
            });
        });

        describe("Locator.dblclick:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const argsAltered = await listener([{ trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ trial: true }]);
                assert.equal(locator.dblclick.mock.callCount(), 0);
            });

            it("should do nothing when 'steps'", async () => {
                const locator = new LocatorMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const argsAltered = await listener([{ steps: 1 }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ steps: 1 }]);
                assert.equal(locator.dblclick.mock.callCount(), 0);
            });
        });

        describe("Locator.hover:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Locator.hover:before"];
                const argsAltered = await listener([{ trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ trial: true }]);
                assert.equal(locator.hover.mock.callCount(), 0);
            });
        });

        describe("Locator.setChecked:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Locator.setChecked:before"];
                const argsAltered = await listener([false, { trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [false, { trial: true }]);
                assert.equal(locator.setChecked.mock.callCount(), 0);
            });
        });

        describe("Locator.uncheck:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Locator.uncheck:before"];
                const argsAltered = await listener([{ trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ trial: true }]);
                assert.equal(locator.uncheck.mock.callCount(), 0);
            });
        });

        describe("Mouse.click:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'steps'", async () => {
                const mouse = new MouseMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Mouse.click:before"];
                const argsAltered = await listener([42, 43, { steps: 1 }], {
                    obj: mouse,
                });

                assert.deepEqual(argsAltered, [42, 43, { steps: 1 }]);
                assert.equal(mouse.move.mock.callCount(), 0);
            });
        });

        describe("Mouse.dblclick:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'steps'", async () => {
                const mouse = new MouseMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Mouse.dblclick:before"];
                const argsAltered = await listener([42, 43, { steps: 1 }], {
                    obj: mouse,
                });

                assert.deepEqual(argsAltered, [42, 43, { steps: 1 }]);
                assert.equal(mouse.move.mock.callCount(), 0);
            });
        });

        describe("Mouse.move:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'steps'", async () => {
                const mouse = new MouseMock();

                const plugin = humanizeCursorPlugin();
                const listener = plugin["Mouse.move:before"];
                const argsAltered = await listener([42, 43, { steps: 1 }], {
                    obj: mouse,
                });

                assert.deepEqual(argsAltered, [42, 43, { steps: 1 }]);
                assert.equal(mouse.move.mock.callCount(), 0);
            });
        });
    });
});
