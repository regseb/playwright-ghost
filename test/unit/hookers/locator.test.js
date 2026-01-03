/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import LocatorHooker from "../../../src/hookers/locator.js";

describe("hookers/locator.js", () => {
    describe("LocatorHooker", () => {
        describe("PRESETS", () => {
            it("should have presets", () => {
                const pointers = Object.keys(LocatorHooker.PRESETS);
                assert.deepEqual(pointers, [
                    "Page.getByAltText:after",
                    "Page.getByLabel:after",
                    "Page.getByPlaceholder:after",
                    "Page.getByRole:after",
                    "Page.getByTestId:after",
                    "Page.getByText:after",
                    "Page.getByTitle:after",
                    "Page.locator:after",
                    "Frame.getByAltText:after",
                    "Frame.getByLabel:after",
                    "Frame.getByPlaceholder:after",
                    "Frame.getByRole:after",
                    "Frame.getByTestId:after",
                    "Frame.getByText:after",
                    "Frame.getByTitle:after",
                    "Frame.locator:after",
                    "Locator.all:after",
                    "Locator.and:after",
                    "Locator.describe:after",
                    "Locator.filter:after",
                    "Locator.first:after",
                    "Locator.getByAltText:after",
                    "Locator.getByLabel:after",
                    "Locator.getByPlaceholder:after",
                    "Locator.getByRole:after",
                    "Locator.getByTestId:after",
                    "Locator.getByText:after",
                    "Locator.getByTitle:after",
                    "Locator.last:after",
                    "Locator.locator:after",
                    "Locator.nth:after",
                    "Locator.or:after",
                    "FrameLocator.getByAltText:after",
                    "FrameLocator.getByLabel:after",
                    "FrameLocator.getByPlaceholder:after",
                    "FrameLocator.getByRole:after",
                    "FrameLocator.getByTestId:after",
                    "FrameLocator.getByText:after",
                    "FrameLocator.getByTitle:after",
                    "FrameLocator.locator:after",
                ]);

                const listeners = Object.values(LocatorHooker.PRESETS);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });

        describe("constructor", () => {
            it("should add hooks in first", () => {
                const locator = new LocatorHooker(new Map());
                const first = locator.first();

                const pointers = Object.keys(first);
                assert.deepEqual(pointers, [
                    "Page.getByAltText:after",
                    "Page.getByLabel:after",
                    "Page.getByPlaceholder:after",
                    "Page.getByRole:after",
                    "Page.getByTestId:after",
                    "Page.getByText:after",
                    "Page.getByTitle:after",
                    "Page.locator:after",
                    "Frame.getByAltText:after",
                    "Frame.getByLabel:after",
                    "Frame.getByPlaceholder:after",
                    "Frame.getByRole:after",
                    "Frame.getByTestId:after",
                    "Frame.getByText:after",
                    "Frame.getByTitle:after",
                    "Frame.locator:after",
                    "Locator.all:after",
                    "Locator.and:after",
                    "Locator.describe:after",
                    "Locator.filter:after",
                    "Locator.first:after",
                    "Locator.getByAltText:after",
                    "Locator.getByLabel:after",
                    "Locator.getByPlaceholder:after",
                    "Locator.getByRole:after",
                    "Locator.getByTestId:after",
                    "Locator.getByText:after",
                    "Locator.getByTitle:after",
                    "Locator.last:after",
                    "Locator.locator:after",
                    "Locator.nth:after",
                    "Locator.or:after",
                    "FrameLocator.getByAltText:after",
                    "FrameLocator.getByLabel:after",
                    "FrameLocator.getByPlaceholder:after",
                    "FrameLocator.getByRole:after",
                    "FrameLocator.getByTestId:after",
                    "FrameLocator.getByText:after",
                    "FrameLocator.getByTitle:after",
                    "FrameLocator.locator:after",
                ]);

                const listeners = Object.values(first);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add hook in last", () => {
                const locator = new LocatorHooker(new Map());
                const last = locator.last();

                const pointers = Object.keys(last);
                assert.deepEqual(pointers, [
                    "Page.getByAltText:after",
                    "Page.getByLabel:after",
                    "Page.getByPlaceholder:after",
                    "Page.getByRole:after",
                    "Page.getByTestId:after",
                    "Page.getByText:after",
                    "Page.getByTitle:after",
                    "Page.locator:after",
                    "Frame.getByAltText:after",
                    "Frame.getByLabel:after",
                    "Frame.getByPlaceholder:after",
                    "Frame.getByRole:after",
                    "Frame.getByTestId:after",
                    "Frame.getByText:after",
                    "Frame.getByTitle:after",
                    "Frame.locator:after",
                    "Locator.all:after",
                    "Locator.and:after",
                    "Locator.describe:after",
                    "Locator.filter:after",
                    "Locator.first:after",
                    "Locator.getByAltText:after",
                    "Locator.getByLabel:after",
                    "Locator.getByPlaceholder:after",
                    "Locator.getByRole:after",
                    "Locator.getByTestId:after",
                    "Locator.getByText:after",
                    "Locator.getByTitle:after",
                    "Locator.last:after",
                    "Locator.locator:after",
                    "Locator.nth:after",
                    "Locator.or:after",
                    "FrameLocator.getByAltText:after",
                    "FrameLocator.getByLabel:after",
                    "FrameLocator.getByPlaceholder:after",
                    "FrameLocator.getByRole:after",
                    "FrameLocator.getByTestId:after",
                    "FrameLocator.getByText:after",
                    "FrameLocator.getByTitle:after",
                    "FrameLocator.locator:after",
                ]);

                const listeners = Object.values(last);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });
    });
});
