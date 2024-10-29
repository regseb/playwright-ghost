/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/**
 * Cherche un programme dans le `PATH`.
 *
 * @param {string} programname Le nom du programme cherché.
 * @returns {Promise<string>} Une promesse contenant le chemin vers le
 *                            programme.
 */
export default async function which(programname) {
    for (const directory of process.env.PATH?.split(path.delimiter) ?? []) {
        const file = path.join(directory, programname);
        try {
            await fs.access(file, fs.constants.X_OK);
            // Si la méthode n'a pas échoué, c'est que le fichier est
            // exécutable : retourner le fichier.
            return file;
        } catch {
            // Si la méthode remonte une erreur, c'est que le fichier n'existe
            // pas ou n'est pas exécutable : passer au prochain répertoire.
        }
    }
    throw new Error(`${programname} not found`);
}
