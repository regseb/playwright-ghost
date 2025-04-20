/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import Ghost from "../../src/ghost.js";

describe("ghost.js", () => {
    describe("Ghost", () => {
        describe("executablePath()", () => {
            it("should return executable path", () => {
                const executablePath = mock.fn(() => "/usr/bin/firefox");
                const browserType = new Ghost({ executablePath });

                const result = browserType.executablePath();

                assert.equal(result, "/usr/bin/firefox");

                assert.equal(executablePath.mock.callCount(), 1);
            });
        });

        describe("launch()", () => {
            it("should return browser", async () => {
                const launch = mock.fn(() => Promise.resolve({ foo: "bar" }));
                const browserType = new Ghost({ launch });

                const browser = await browserType.launch();

                assert.equal(browser.foo, "bar");

                assert.equal(launch.mock.callCount(), 1);
                assert.deepEqual(launch.mock.calls[0].arguments, [undefined]);
            });
        });

        describe("launchPersistentContext()", () => {
            it("should return browser", async () => {
                const launchPersistentContext = mock.fn(() =>
                    Promise.resolve({ foo: "bar" }),
                );
                const browserType = new Ghost({ launchPersistentContext });

                const browser =
                    await browserType.launchPersistentContext("/tmp/userdir/");

                assert.equal(browser.foo, "bar");

                assert.equal(launchPersistentContext.mock.callCount(), 1);
                assert.deepEqual(
                    launchPersistentContext.mock.calls[0].arguments,
                    ["/tmp/userdir/", undefined],
                );
            });
        });

        describe("name()", () => {
            it("should return name", () => {
                const name = mock.fn(() => "chromium");
                const browserType = new Ghost({ name });

                const result = browserType.name();

                assert.equal(result, "chromium");

                assert.equal(name.mock.callCount(), 1);
            });
        });
    });
});
