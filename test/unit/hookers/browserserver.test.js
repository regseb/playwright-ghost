/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import BrowserServerHooker from "../../../src/hookers/browserserver.js";

describe("hookers/browserserver.js", () => {
    describe("BrowserServerHooker", () => {
        describe("PRESETS", () => {
            it("should have presets", () => {
                const pointers = Object.keys(BrowserServerHooker.PRESETS);
                assert.deepEqual(pointers, ["BrowserType.launchServer:after"]);

                const listeners = Object.values(BrowserServerHooker.PRESETS);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });

        describe("constructor", () => {
            it("should add hooks in first", () => {
                const browserServer = new BrowserServerHooker(new Map());
                const first = browserServer.first();

                const pointers = Object.keys(first);
                assert.deepEqual(pointers, ["BrowserType.launchServer:after"]);

                const listeners = Object.values(first);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add hook in last", () => {
                const browserServer = new BrowserServerHooker(new Map());
                const last = browserServer.last();

                const pointers = Object.keys(last);
                assert.deepEqual(pointers, ["BrowserType.launchServer:after"]);

                const listeners = Object.values(last);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });
    });
});
