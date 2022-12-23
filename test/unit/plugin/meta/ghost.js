import assert from "node:assert/strict";
import { chromium } from "../../../../src/index.js";

/* global Navigator, navigator */

const evaluate = async function (test) {
    const browser = await chromium.launch({
        plugins: {
            "*":                  false,
            "polyfill/webdriver": true,
            "util/debug":         true,
        },
    });
    const context = await browser.newContext();
    try {
        const page = await context.newPage();
        await page.goto("about:blank");
        await page.addScriptTag({
            url: "https://cdn.jsdelivr.net/npm/jsondiffpatch@0.4.1/dist" +
                 "/jsondiffpatch.umd.js",
        });
        await page.addScriptTag({ path: "./test/unit/assert.injected.js" });

        await page.evaluate(test);
    } finally {
        await context.close();
        await browser.close();
    }
};

describe("plugin/meta/ghost.js", function () {
    describe("Ghost.defineProperty()", function () {
        it("should replace function", function () {
            return evaluate(() => {
               assert.equal(navigator.webdriver, false);
            });
        });

        it("should keep descriptor", function () {
            return evaluate(() => {
                const descriptor = Object.getOwnPropertyDescriptor(
                    Navigator.prototype,
                    "webdriver",
                );
                assert.equal(typeof descriptor.get, "function");
                delete descriptor.get;
                assert.deepEqual(descriptor, {
                    configurable: true,
                    enumerable:   true,
                    set:          undefined,
                });
            });
        });
    });
});
