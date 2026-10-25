/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import Ghost from "../../src/ghost.js";

describe("ghost.js", () => {
    describe("Ghost", () => {
        describe("connect()", () => {
            it("should return browser", async () => {
                const connect = mock.fn(() => Promise.resolve({ foo: "bar" }));
                // @ts-expect-error -- Seule la méthode `connect` est testée.
                const browserType = new Ghost({ connect });

                const browser = await browserType.connect("ws://localhost/", {
                    slowMo: true,
                });

                assert.equal(browser.foo, "bar");

                assert.equal(connect.mock.callCount(), 1);
                assert.deepEqual(connect.mock.calls[0].arguments, [
                    "ws://localhost/",
                    { slowMo: true },
                ]);
            });
        });

        describe("connectOverCDP()", () => {
            it("should return browser", async () => {
                const connectOverCDP = mock.fn(() =>
                    Promise.resolve({ foo: "bar" }),
                );
                // @ts-expect-error -- Seule la méthode `connectOverCDP` est
                //                     testée.
                const browserType = new Ghost({ connectOverCDP });

                const browser = await browserType.connectOverCDP(
                    "ws://localhost/",
                    { timeout: 42 },
                );

                assert.equal(browser.foo, "bar");

                assert.equal(connectOverCDP.mock.callCount(), 1);
                assert.deepEqual(connectOverCDP.mock.calls[0].arguments, [
                    "ws://localhost/",
                    { timeout: 42 },
                ]);
            });
        });

        describe("executablePath()", () => {
            it("should return executable path", () => {
                const executablePath = mock.fn(() => "/usr/bin/firefox");
                // @ts-expect-error -- Seule la méthode `executablePath` est
                //                     testée.
                const browserType = new Ghost({ executablePath });

                const result = browserType.executablePath();

                assert.equal(result, "/usr/bin/firefox");

                assert.equal(executablePath.mock.callCount(), 1);
            });
        });

        describe("launch()", () => {
            it("should return browser", async () => {
                const launch = mock.fn(() => Promise.resolve({ foo: "bar" }));
                // @ts-expect-error -- Seule la méthode `launch` est testée.
                const browserType = new Ghost({ launch });

                const browser = await browserType.launch({ slowMo: 42 });

                assert.equal(browser.foo, "bar");

                assert.equal(launch.mock.callCount(), 1);
                assert.deepEqual(launch.mock.calls[0].arguments, [
                    { slowMo: 42 },
                ]);
            });
        });

        describe("launchPersistentContext()", () => {
            it("should return context", async () => {
                const launchPersistentContext = mock.fn(() =>
                    Promise.resolve({
                        pages: () => [],
                        foo: "bar",
                    }),
                );
                // @ts-expect-error -- Seule la méthode
                //                     `launchPersistentContext` est testée.
                const browserType = new Ghost({ launchPersistentContext });

                const browser = await browserType.launchPersistentContext(
                    "/tmp/userdir/",
                    { acceptDownloads: true },
                );

                assert.equal(browser.foo, "bar");

                assert.equal(launchPersistentContext.mock.callCount(), 1);
                assert.deepEqual(
                    launchPersistentContext.mock.calls[0].arguments,
                    ["/tmp/userdir/", { acceptDownloads: true }],
                );
            });
        });

        describe("launchServer()", () => {
            it("should return server", async () => {
                const launchServer = mock.fn(() =>
                    Promise.resolve({ foo: "bar" }),
                );
                // @ts-expect-error -- Seule la méthode `launchServer` est
                //                     testée.
                const browserType = new Ghost({ launchServer });

                const server = await browserType.launchServer({
                    channel: "chrome",
                });

                assert.equal(server.foo, "bar");

                assert.equal(launchServer.mock.callCount(), 1);
                assert.deepEqual(launchServer.mock.calls[0].arguments, [
                    { channel: "chrome" },
                ]);
            });
        });

        describe("name()", () => {
            it("should return name", () => {
                const name = mock.fn(() => "chromium");
                // @ts-expect-error -- Seule la méthode `name` est testée.
                const browserType = new Ghost({ name });

                const result = browserType.name();

                assert.equal(result, "chromium");

                assert.equal(name.mock.callCount(), 1);
            });
        });
    });
});
