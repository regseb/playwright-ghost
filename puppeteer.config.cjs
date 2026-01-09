/**
 * @license MIT
 * @author Sébastien Règne
 */

// Ajouter la dépendance "puppeteer" dans le package.json, car l'import de
// "ghost-cursor" a besoin des types de Puppeteer.
// https://github.com/Xetera/ghost-cursor/pull/171

// Utiliser un fichier de configuration CJS, car Puppeteer ne gère pas les
// fichiers de configuration ESM.
// https://github.com/puppeteer/puppeteer/issues/14268
module.exports = {
    // Ne pas télécharger les navigateurs, car la dépendance Puppeteer est
    // utilisé seulement pour ses types.
    skipDownload: true,
}
