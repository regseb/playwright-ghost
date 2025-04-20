/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fingerprintPlugin from "../../../../src/plugins/utils/fingerprint.js";

describe("plugins/utils/fingerprint.js", () => {
    describe("fingerprintPlugin()", () => {
        describe("BrowserType.launchPersistentContext:before", () => {
            it("should generate fingerprint", async () => {
                const plugin = await fingerprintPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const store = {};
                const argsAltered = listener(["./foo/"], { store });

                assert.equal(argsAltered[0], "./foo/");
                assert.equal(argsAltered[1].colorScheme, "dark");
                assert.equal(
                    typeof argsAltered[1].extraHTTPHeaders["accept-language"],
                    "string",
                );
                assert.equal(typeof argsAltered[1].userAgent, "string");
                assert.equal(typeof argsAltered[1].viewport.height, "number");
                assert.equal(typeof argsAltered[1].viewport.width, "number");

                const symbols = Object.getOwnPropertySymbols(store);
                assert.equal(symbols.length, 1);
                const fingerprintWithHeaders = store[symbols[0]];
                assert.equal(
                    typeof fingerprintWithHeaders.fingerprint,
                    "object",
                );
                assert.equal(typeof fingerprintWithHeaders.headers, "object");
            });
        });

        describe("Browser.newContext:before", () => {
            it("should add fingerprint in options", async () => {
                const plugin = await fingerprintPlugin();
                const listener = plugin["Browser.newContext:before"];
                const store = {};
                const argsAltered = listener([], { store });

                assert.equal(argsAltered[0].colorScheme, "dark");
                assert.equal(
                    typeof argsAltered[0].extraHTTPHeaders["accept-language"],
                    "string",
                );
                assert.equal(typeof argsAltered[0].userAgent, "string");
                assert.equal(typeof argsAltered[0].viewport.height, "number");
                assert.equal(typeof argsAltered[0].viewport.width, "number");

                const symbols = Object.getOwnPropertySymbols(store);
                assert.equal(symbols.length, 1);
                const fingerprintWithHeaders = store[symbols[0]];
                assert.equal(
                    typeof fingerprintWithHeaders.fingerprint,
                    "object",
                );
                assert.equal(typeof fingerprintWithHeaders.headers, "object");
            });
        });
    });
});
