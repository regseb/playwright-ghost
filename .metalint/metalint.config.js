/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

export default {
    patterns: [
        "!/.git/",
        "!/jsdocs/",
        "!/log/",
        "!/node_modules/",
        "!/.stryker/",
        "!*.swp",
        "**",
    ],
    checkers: [
        {
            patterns: ["/.script/**/*.js", "/src/**/*.js"],
            linters: {
                eslint: ["eslint.config.js", "eslint_node.config.js"],
            },
        }, {
            patterns: "/test/**/*.js",
            linters: {
                eslint: [
                    "eslint.config.js",
                    "eslint_node.config.js",
                    "eslint_test.config.js",
                ],
            },
        }, {
            patterns: "*.config.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_config.config.js"],
            },
        }, {
            patterns: "*.md",
            linters: "markdownlint",
        }, {
            patterns: "*.json",
            linters: { "jsonlint-mod": null },
        }, {
            patterns: "/package.json",
            linters: "npm-package-json-lint",
        }, {
            patterns: "*.yml",
            linters: { "yaml-lint": null },
        },
    ],
};
