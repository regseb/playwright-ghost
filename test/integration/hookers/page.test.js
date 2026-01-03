/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../src/index.js";

/**
 * @import { Page } from "playwright";
 */

describe("Hooker: page", () => {
    it("should add plugin in Page", async () => {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Page:new": (/** @type {Page} */ page) => {
                        // eslint-disable-next-line no-param-reassign
                        page.foo = "bar";
                        return page;
                    },
                },
            ],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            assert.equal(page.foo, "bar");
        } finally {
            await context.close();
            await browser.close();
        }
    });

    it("should add plugin in default Page", async () => {
        const context = await vanilla.chromium.launchPersistentContext("", {
            plugins: [
                {
                    "Page:new": (/** @type {Page} */ page) => {
                        // eslint-disable-next-line no-param-reassign
                        page.foo = "bar";
                        return page;
                    },
                },
            ],
        });
        try {
            const page = context.pages()[0];
            assert.equal(page.foo, "bar");
        } finally {
            await context.close();
        }
    });
});
