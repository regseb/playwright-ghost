/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import Ghost from "../../src/ghost.js";

describe("ghost.js", function () {
    describe("Ghost", function () {
        describe("executablePath()", function () {
            it("should return executable path", function () {
                const executablePath = mock.fn(() => "/usr/bin/firefox");
                const browserType = new Ghost({ executablePath });

                const result = browserType.executablePath();

                assert.equal(result, "/usr/bin/firefox");

                assert.equal(executablePath.mock.calls.length, 1);
            });
        });

        describe("launch()", function () {
            it("should return browser", async function () {
                const launch = mock.fn(() => Promise.resolve({ foo: "bar" }));
                const browserType = new Ghost({ launch });

                const browser = await browserType.launch();

                assert.equal(browser.foo, "bar");

                assert.equal(launch.mock.calls.length, 1);
                assert.deepEqual(launch.mock.calls[0].arguments, [undefined]);
            });
        });

        describe("launchPersistentContext()", function () {
            it("should return browser", async function () {
                const launchPersistentContext = mock.fn(() =>
                    Promise.resolve({ foo: "bar" }),
                );
                const browserType = new Ghost({ launchPersistentContext });

                const browser =
                    await browserType.launchPersistentContext("/tmp/userdir/");

                assert.equal(browser.foo, "bar");

                assert.equal(launchPersistentContext.mock.calls.length, 1);
                assert.deepEqual(
                    launchPersistentContext.mock.calls[0].arguments,
                    ["/tmp/userdir/", undefined],
                );
            });
        });

        describe("name()", function () {
            it("should return name", function () {
                const name = mock.fn(() => "chromium");
                const browserType = new Ghost({ name });

                const result = browserType.name();

                assert.equal(result, "chromium");

                assert.equal(name.mock.calls.length, 1);
            });
        });
    });
});
