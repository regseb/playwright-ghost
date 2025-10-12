/**
 * @license MIT
 * @author Sébastien Règne
 */

import process from "node:process";
import timers from "node:timers/promises";
import packageConfig from "../package.json" with { type: "json" };

const name = packageConfig.name;
const version = packageConfig.version;

process.exitCode = 1;

// Vérifier si le paquet est publié dans npm pendant une minute (en essayant
// toutes les cinq secondes).
for (let i = 0; 12 > i; ++i) {
    const response = await fetch(`https://registry.npmjs.org/${name}`);
    const json = await response.json();
    if (version in json.versions) {
        process.exitCode = 0;
        break;
    }
    await timers.setTimeout(5000);
}
