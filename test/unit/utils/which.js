/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { afterEach, describe, it, mock } from "node:test";
import which from "../../../src/utils/which.js";

const ORIGINAL_PATH = process.env.PATH;

/**
 * Localise un `PATH` au format de la machine.
 *
 * @param {string} PATH Un `PATH` au format POSIX.
 * @returns {string} Le `PATH` au format de la machine (Windows ou POSIX).
 */
const localize = (PATH) => {
    return PATH.replaceAll(":", path.delimiter).replaceAll("/", path.sep);
};

describe("utils/which.js", () => {
    describe("which()", () => {
        afterEach(() => {
            process.env.PATH = ORIGINAL_PATH;
        });

        it("should support no PATH", async () => {
            delete process.env.PATH;

            await assert.rejects(() => which("firefox"), {
                name: "Error",
                message: "firefox not found",
            });
        });

        it("should return file", async () => {
            process.env.PATH = localize("/usr/local/bin:/usr/bin:/bin");
            const access = mock.method(
                fs,
                "access",
                (/** @type {string} */ file) =>
                    file.startsWith(localize("/usr/bin/"))
                        ? Promise.resolve()
                        : Promise.reject(
                              new Error(
                                  "ENOENT: no such file or directory, access" +
                                      ` '${file}'`,
                              ),
                          ),
            );

            const file = await which("chromium");

            assert.equal(file, localize("/usr/bin/chromium"));

            assert.equal(access.mock.callCount(), 2);
            assert.deepEqual(access.mock.calls[0].arguments, [
                localize("/usr/local/bin/chromium"),
                fs.constants.X_OK,
            ]);
            assert.deepEqual(access.mock.calls[1].arguments, [
                localize("/usr/bin/chromium"),
                fs.constants.X_OK,
            ]);
        });

        it("should throw error when not found", async () => {
            process.env.PATH = localize("/usr/local/bin:/usr/bin:/bin");
            const access = mock.method(
                fs,
                "access",
                (/** @type {string} */ file) =>
                    Promise.reject(
                        new Error(
                            `ENOENT: no such file or directory, access '${file}'`,
                        ),
                    ),
            );

            await assert.rejects(() => which("webkit"), {
                name: "Error",
                message: "webkit not found",
            });

            assert.equal(access.mock.callCount(), 3);
            assert.deepEqual(access.mock.calls[0].arguments, [
                localize("/usr/local/bin/webkit"),
                fs.constants.X_OK,
            ]);
            assert.deepEqual(access.mock.calls[1].arguments, [
                localize("/usr/bin/webkit"),
                fs.constants.X_OK,
            ]);
            assert.deepEqual(access.mock.calls[2].arguments, [
                localize("/bin/webkit"),
                fs.constants.X_OK,
            ]);
        });
    });
});
