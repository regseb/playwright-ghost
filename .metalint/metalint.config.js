/**
 * @license MIT
 * @see https://github.com/regseb/metalint
 * @author Sébastien Règne
 */

/**
 * @import { Config } from "metalint/types"
 */

/**
 * @type {Config}
 */
export default {
    patterns: [
        "**",
        // Ignorer les répertoires et les fichiers générés.
        "!/.git/**",
        "!/.stryker/**",
        "!/jsdocs/**",
        "!/log/**",
        "!/node_modules/**",
        "!/stryker.log",
        "!/types/**",
        // Ignorer les fichiers de configuration de Visual Studio Code.
        "!/.vscode/**",
        // Ignorer les fichiers de configuration des IDEs de JetBrains :
        // WebStorm, IntelliJ IDEA...
        "!/.idea/**",
        // Ignorer les fichiers temporaires de Vim.
        "!*.swp",
        // Ignorer les autres lockfiles.
        "!/bun.lockb",
        "!/pnpm-lock.yaml",
        "!/yarn.lock",
    ],
    checkers: [
        {
            patterns: "*.js",
            linters: [
                "prettier",
                "prettier_javascript",
                "eslint",
                "eslint_node",
            ],
            overrides: [
                {
                    patterns: "/test/**",
                    linters: "eslint_test",
                },
                {
                    patterns: "*.config.js",
                    linters: "eslint_config",
                },
            ],
        },
        {
            patterns: "*.md",
            linters: ["prettier", "markdownlint"],
        },
        {
            patterns: "*.json",
            linters: ["prettier", "prantlf__jsonlint"],
            overrides: {
                patterns: "/package.json",
                linters: ["npm-package-json-lint", "publint"],
            },
        },
        {
            patterns: "*.yml",
            linters: ["prettier", "yaml-lint"],
        },
        {
            patterns: "*.svg",
            linters: "prettier",
        },
    ],
};
