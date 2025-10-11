/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import debugSnifferPlugin from "../../../../src/plugins/debug/sniffer.js";

describe("Plugin: debug.sniffer", () => {
    it("should sniff JavaScript", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [debugSnifferPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://www.wikipedia.org/");

            const used = page.sniffer.get();
            assert.notEqual(Object.keys(used).length, 0);
            assert.deepEqual(used["JSON.parse"], ["get"]);
            assert.deepEqual(used["HTMLSelectElement.prototype.value"], [
                "get",
                "set",
            ]);
        } finally {
            await context.close();
            await browser.close();
        }
    });

    it("should reset list", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [debugSnifferPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://www.wikipedia.org/");

            page.sniffer.reset();
            const used = page.sniffer.get();
            assert.equal(Object.keys(used).length, 0);
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
