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
            // Ne pas charger les ressources inutiles (pour accélérer le temps
            // d'exécution).
            await page.route("**/*", (route) => {
                const resourceType = route.request().resourceType();
                if (["document", "script"].includes(resourceType)) {
                    route.continue();
                } else {
                    route.abort();
                }
            });
            await page.goto("https://planet.debian.org/");

            const used = page.sniffer.get();
            assert.deepEqual(used, {
                "https://planet.debian.org/": [
                    "__playwright__binding__",
                    "__playwright__binding__controller__",
                    "__playwright__binding__controller__._bindings",
                    "__playwright__binding__controller__._global",
                    "__playwright__binding__controller__._globalBindingName",
                    "Array",
                    "Array.isArray",
                    "Array.prototype.constructor",
                    "Array.prototype.push",
                    "Array.prototype.slice",
                    "ArrayBuffer",
                    "BigInt64Array.name",
                    "BigUint64Array.name",
                    "Blob",
                    "Date",
                    "Document",
                    "Document.prototype.cookie",
                    "Document.prototype.write",
                    "Error",
                    "eval",
                    "Float32Array.name",
                    "Float64Array.name",
                    "Function.prototype.call",
                    "globalThis",
                    "Int16Array.name",
                    "Int32Array.name",
                    "Int8Array.name",
                    "JSON",
                    "JSON.stringify",
                    "Map",
                    "Map.prototype.delete",
                    "Map.prototype.get",
                    "Map.prototype.set",
                    "Node",
                    "Object",
                    "Object.entries",
                    "Object.getPrototypeOf",
                    "Object.is",
                    "Object.keys",
                    "Object.prototype.toString",
                    "onload",
                    "Promise",
                    "RegExp",
                    "String.prototype.charAt",
                    "String.prototype.indexOf",
                    "String.prototype.split",
                    "Uint16Array.name",
                    "Uint32Array.name",
                    "Uint8Array.name",
                    "Uint8ClampedArray.name",
                    "URL",
                    "Window",
                ],
            });
        } finally {
            await context.close();
            await browser.close();
        }
    });

    it("should sniff many pages", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [debugSnifferPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://www.wikipedia.org/");
            await page.locator("#js-link-box-fr").click();
            await page.waitForURL("https://fr.wikipedia.org/**");

            const used = page.sniffer.get();
            assert.deepEqual(Object.keys(used), [
                "https://www.wikipedia.org/",
                "https://fr.wikipedia.org/wiki" +
                    "/Wikip%C3%A9dia:Accueil_principal",
            ]);
            assert.ok(
                used["https://www.wikipedia.org/"].includes("JSON.parse"),
            );
            assert.ok(
                used["https://www.wikipedia.org/"].includes(
                    "HTMLSelectElement.prototype.value",
                ),
            );
            assert.ok(
                used[
                    "https://fr.wikipedia.org/wiki" +
                        "/Wikip%C3%A9dia:Accueil_principal"
                ].includes("JSON.parse"),
            );
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
            await page.goto("https://ubuntu.com/");

            page.sniffer.reset();
            const used = page.sniffer.get();
            assert.deepEqual(used, {});
        } finally {
            await context.close();
            await browser.close();
        }
    });
});
