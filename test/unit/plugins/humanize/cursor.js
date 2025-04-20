/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import cursorPlugin from "../../../../src/plugins/humanize/cursor.js";

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

                const mouse = {};
describe("plugins/humanize/cursor.js", () => {
    describe("cursorPlugin()", () => {
        describe("Page:new", () => {
            it("should support no option", () => {

                const plugin = cursorPlugin();
                const listener = plugin["Mouse:new"];
                const mouseAltered = listener(mouse);

                // Vérifier que la souris retournée est la même instance que
                // celle en paramètre.
                assert.equal(mouseAltered, mouse);
                const symbols = Object.getOwnPropertySymbols(mouse);
                assert.equal(symbols.length, 1);
                const start = mouse[symbols[0]];
                assert.deepEqual(start, { x: 0, y: 0 });
            });

                const mouse = {};
            it("should support empty option", () => {

                const plugin = cursorPlugin({});
                const listener = plugin["Mouse:new"];
                const mouseAltered = listener(mouse);

                // Vérifier que la souris retournée est la même instance que
                // celle en paramètre.
                assert.equal(mouseAltered, mouse);
                const symbols = Object.getOwnPropertySymbols(mouse);
                assert.equal(symbols.length, 1);
                const start = mouse[symbols[0]];
                assert.deepEqual(start, { x: 0, y: 0 });
            });

                const mouse = {};
            it("should support option", () => {

                const plugin = cursorPlugin({ start: { x: 42, y: 43 } });
                const listener = plugin["Mouse:new"];
                const mouseAltered = listener(mouse);

                // Vérifier que la souris retournée est la même instance que
                // celle en paramètre.
                assert.equal(mouseAltered, mouse);
                const symbols = Object.getOwnPropertySymbols(mouse);
                assert.equal(symbols.length, 1);
                const start = mouse[symbols[0]];
                assert.deepEqual(start, { x: 42, y: 43 });
            });
        });

        describe("Locator.check:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = cursorPlugin();
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

                const plugin = cursorPlugin();
                const listener = plugin["Locator.click:before"];
                const argsAltered = await listener([{ trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ trial: true }]);
                assert.equal(locator.click.mock.callCount(), 0);
            });
        });

        describe("Locator.dblclick:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = cursorPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const argsAltered = await listener([{ trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [{ trial: true }]);
                assert.equal(locator.dblclick.mock.callCount(), 0);
            });
        });

        describe("Locator.hover:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = cursorPlugin();
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

                const plugin = cursorPlugin();
                const listener = plugin["Locator.setChecked:before"];
                const argsAltered = await listener([false, { trial: true }], {
                    obj: locator,
                });

                assert.deepEqual(argsAltered, [false, { trial: true }]);
                assert.equal(locator.setChecked.mock.callCount(), 0);
            });
        });

        describe("Locator.uncheck:before", function () {
            afterEach(function () {
                mock.reset();
            });

            it("should do nothing when 'trial'", async () => {
                const locator = new LocatorMock();

                const plugin = cursorPlugin();
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

                const plugin = cursorPlugin();
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

                const plugin = cursorPlugin();
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

                const plugin = cursorPlugin();
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
