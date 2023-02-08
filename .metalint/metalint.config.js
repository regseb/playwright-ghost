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
            patterns: ["!**.injected.js", "/src/**/*.js"],
            linters: {
                eslint: ["eslint.config.js", "eslint_node.config.js"],
            },
        }, {
            patterns: "/src/**/*.injected.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_browser.config.js"],
            },
        }, {
            patterns: ["!/test/data/", "!/test/tool/", "/test/**/*.js"],
            linters: {
                eslint: [
                    "eslint.config.js",
                    "eslint_node.config.js",
                    "eslint_test.config.js",
                ],
            },
        }, {
            patterns: "/.script/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_node.config.js"],
            },
        }, {
            patterns: "/.metalint/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_config.config.js"],
            },
        }, {
            patterns: ["!/CHANGELOG.md", "*.md"],
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
