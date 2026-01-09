/**
 * @license MIT
 * @author Sébastien Règne
 */

import { execSync } from "node:child_process";
import process from "node:process";
import timers from "node:timers/promises";

const max = Number(process.argv[2]);
const delay = Number(process.argv[3]);
const command = process.argv[4];

process.exitCode = 1;
for (let i = 0; i < max; ++i) {
    try {
        // eslint-disable-next-line n/no-sync
        execSync(command, { stdio: "inherit" });
        process.exitCode = 0;
        break;
    } catch {
        await timers.setTimeout(delay);
    }
}
