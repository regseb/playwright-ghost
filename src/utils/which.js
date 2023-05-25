/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/**
 * Cherche un programme dans le <code>PATH</code>.
 *
 * @param {string} programname Le nom du programme cherché.
 * @returns {Promise<string>} Une promesse contenant le chemin vers le
 *                            programme.
 */
export default async function which(programname) {
    for (const directory of process.env.PATH.split(":")) {
        const file = path.join(directory, programname);
        const executable = await fs.access(file, fs.constants.X_OK).then(
            () => true,
            () => false,
        );
        if (executable) {
            return file;
        }
    }
    throw new Error(`${programname} not found`);
}
