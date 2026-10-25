/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { afterEach, describe, it, mock } from "node:test";
import utilsLocalePlugin from "../../../../src/plugins/utils/locale.js";

describe("plugins/utils/locale.js", () => {
    describe("utilsLocalePlugin()", () => {
        afterEach(() => {
            mock.reset();
        });

        describe("BrowserType.launch:before", () => {
            it("should throw error when not found", async () => {
                const name = mock.fn(() => "iexplore");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener = plugin["BrowserType.launch:before"];

                await assert.rejects(() => listener([], { obj: browserType }), {
                    name: "Error",
                    message: "iexplore not found",
                });

                assert.equal(name.mock.callCount(), 1);
            });

            it("should set executablePath", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener = plugin["BrowserType.launch:before"];

                const args = await listener([], { obj: browserType });

                assert.deepEqual(args, [
                    { executablePath: path.join("/", "bin", "chromium") },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should be override by option", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener = plugin["BrowserType.launch:before"];

                const args = await listener(
                    [
                        {
                            executablePath: path.join(
                                "/",
                                "bin",
                                "google-chrome",
                            ),
                        },
                    ],
                    { obj: browserType },
                );

                assert.deepEqual(args, [
                    { executablePath: path.join("/", "bin", "google-chrome") },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support name", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = utilsLocalePlugin({ name: "servo" });
                const listener = plugin["BrowserType.launch:before"];

                const args = await listener([], { obj: browserType });

                assert.deepEqual(args, [
                    { executablePath: path.join("/", "bin", "servo") },
                ]);

                assert.equal(name.mock.callCount(), 0);
            });
        });

        describe("BrowserType.launchPersistentContext:before", () => {
            it("should throw error when not found", async () => {
                const name = mock.fn(() => "iexplore");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];

                await assert.rejects(
                    () => listener(["./foo/"], { obj: browserType }),
                    {
                        name: "Error",
                        message: "iexplore not found",
                    },
                );

                assert.equal(name.mock.callCount(), 1);
            });

            it("should set executablePath", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];

                const args = await listener(["./foo/"], { obj: browserType });

                assert.deepEqual(args, [
                    "./foo/",
                    { executablePath: path.join("/", "bin", "chromium") },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should be override by option", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];

                const args = await listener(
                    [
                        "./foo/",
                        {
                            executablePath: path.join(
                                "/",
                                "bin",
                                "google-chrome",
                            ),
                        },
                    ],
                    { obj: browserType },
                );

                assert.deepEqual(args, [
                    "./foo/",
                    { executablePath: path.join("/", "bin", "google-chrome") },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support name", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = utilsLocalePlugin({ name: "servo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];

                const args = await listener(["./foo/"], { obj: browserType });

                assert.deepEqual(args, [
                    "./foo/",
                    { executablePath: path.join("/", "bin", "servo") },
                ]);

                assert.equal(name.mock.callCount(), 0);
            });
        });

        describe("BrowserType.launchServer:before", () => {
            it("should throw error when not found", async () => {
                const name = mock.fn(() => "iexplore");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener = plugin["BrowserType.launchServer:before"];

                await assert.rejects(() => listener([], { obj: browserType }), {
                    name: "Error",
                    message: "iexplore not found",
                });

                assert.equal(name.mock.callCount(), 1);
            });

            it("should set executablePath", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener = plugin["BrowserType.launchServer:before"];

                const args = await listener([], { obj: browserType });

                assert.deepEqual(args, [
                    { executablePath: path.join("/", "bin", "chromium") },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should be override by option", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = utilsLocalePlugin();
                const listener = plugin["BrowserType.launchServer:before"];

                const args = await listener(
                    [
                        {
                            executablePath: path.join(
                                "/",
                                "bin",
                                "google-chrome",
                            ),
                        },
                    ],
                    { obj: browserType },
                );

                assert.deepEqual(args, [
                    { executablePath: path.join("/", "bin", "google-chrome") },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support name", async () => {
                // Ne pas remplacer seulement le PATH, car mock.property() ne
                // fonctionne pas sur les propriétés de process.env.
                // https://github.com/nodejs/node/issues/60486
                mock.property(process, "env", { PATH: path.join("/", "bin") });
                mock.method(fs, "access", () => Promise.resolve());

                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = utilsLocalePlugin({ name: "servo" });
                const listener = plugin["BrowserType.launchServer:before"];

                const args = await listener([], { obj: browserType });

                assert.deepEqual(args, [
                    { executablePath: path.join("/", "bin", "servo") },
                ]);

                assert.equal(name.mock.callCount(), 0);
            });
        });
    });
});
