/**
 * @license MIT
 * @author Sébastien Règne
 */

// @ts-expect-error -- Le plugin array-func ne fournit pas de types.
import arrayFunc from "eslint-plugin-array-func";
// @ts-expect-error -- Le plugin eslint-comments ne fournit pas de types.
import eslintComments from "eslint-plugin-eslint-comments";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
// @ts-expect-error -- Le plugin no-unsanitized ne fournit pas de types.
import noUnsanitized from "eslint-plugin-no-unsanitized";
// @ts-expect-error -- Le plugin promise ne fournit pas de types.
import promise from "eslint-plugin-promise";
import regexp from "eslint-plugin-regexp";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

/**
 * @import { Linter } from "eslint"
 */

/**
 * @type {Linter.Config}
 */
export default {
    languageOptions: {
        globals: globals["shared-node-browser"],
    },

    linterOptions: {
        reportUnusedInlineConfigs: "error",
    },

    plugins: {
        "array-func": arrayFunc,
        "eslint-comments": eslintComments,
        import: importPlugin,
        jsdoc,
        "no-unsanitized": noUnsanitized,
        promise,
        regexp,
        unicorn,
    },

    rules: {
        // Possible Problems.
        "array-callback-return": "error",
        "constructor-super": "error",
        "for-direction": "error",
        "getter-return": "error",
        "no-async-promise-executor": "error",
        "no-await-in-loop": "off",
        "no-class-assign": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign": "error",
        "no-const-assign": "error",
        "no-constant-binary-expression": "error",
        "no-constant-condition": "error",
        "no-constructor-return": "error",
        "no-control-regex": "error",
        "no-debugger": "error",
        "no-dupe-args": "error",
        "no-dupe-class-members": "error",
        "no-dupe-else-if": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": "error",
        "no-empty-character-class": "error",
        "no-empty-pattern": "error",
        "no-ex-assign": "error",
        "no-fallthrough": "error",
        "no-func-assign": "error",
        "no-import-assign": "error",
        "no-inner-declarations": ["error", "both"],
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": [
            "error",
            {
                skipStrings: false,
                skipComments: false,
                skipRegExps: false,
                skipTemplates: false,
            },
        ],
        "no-loss-of-precision": "error",
        "no-misleading-character-class": ["error", { allowEscape: true }],
        "no-new-native-nonconstructor": "error",
        "no-new-symbol": "error",
        "no-obj-calls": "error",
        "no-promise-executor-return": "error",
        "no-prototype-builtins": "error",
        "no-self-assign": "error",
        "no-self-compare": "error",
        "no-setter-return": "error",
        "no-sparse-arrays": "error",
        "no-template-curly-in-string": "error",
        "no-this-before-super": "error",
        "no-unassigned-vars": "error",
        "no-undef": "error",
        "no-unexpected-multiline": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable": "error",
        "no-unreachable-loop": "error",
        "no-unsafe-finally": "error",
        "no-unsafe-negation": ["error", { enforceForOrderingRelations: true }],
        "no-unsafe-optional-chaining": [
            "error",
            {
                disallowArithmeticOperators: true,
            },
        ],
        "no-unused-private-class-members": "error",
        "no-unused-vars": [
            "error",
            {
                args: "all",
                argsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
        "no-use-before-define": "error",
        "no-useless-backreference": "error",
        "require-atomic-updates": "off",
        "use-isnan": [
            "error",
            {
                enforceForSwitchCase: true,
                enforceForIndexOf: true,
            },
        ],
        "valid-typeof": "error",

        // Suggestions.
        "accessor-pairs": ["error", { enforceForClassMembers: true }],
        "arrow-body-style": "off",
        "block-scoped-var": "error",
        camelcase: "error",
        "capitalized-comments": [
            "error",
            "always",
            {
                ignorePattern: "prettier-ignore",
                ignoreConsecutiveComments: true,
            },
        ],
        "class-methods-use-this": "error",
        complexity: ["warn", { max: 50, variant: "modified" }],
        "consistent-return": "error",
        "consistent-this": "error",
        curly: "error",
        "default-case": "error",
        "default-case-last": "error",
        "default-param-last": "error",
        "dot-notation": ["error", { allowKeywords: true, allowPattern: "_" }],
        eqeqeq: "error",
        "func-name-matching": ["error", { considerPropertyDescriptor: true }],
        "func-names": ["error", "as-needed"],
        "func-style": "error",
        "grouped-accessor-pairs": ["error", "getBeforeSet"],
        "guard-for-in": "error",
        "id-denylist": "off",
        "id-length": "off",
        "id-match": "off",
        "init-declarations": "off",
        "logical-assignment-operators": [
            "error",
            "always",
            {
                enforceForIfStatements: true,
            },
        ],
        "max-classes-per-file": "error",
        "max-depth": ["warn", { max: 5 }],
        "max-lines": [
            "warn",
            {
                max: 1000,
                skipBlankLines: true,
                skipComments: true,
            },
        ],
        "max-lines-per-function": [
            "warn",
            {
                max: 100,
                skipBlankLines: true,
                skipComments: true,
            },
        ],
        "max-nested-callbacks": "warn",
        "max-params": ["warn", { max: 5 }],
        "max-statements": ["warn", { max: 50 }],
        "new-cap": "error",
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-bitwise": "off",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-console": "error",
        "no-continue": "off",
        "no-delete-var": "error",
        "no-div-regex": "error",
        "no-else-return": ["error", { allowElseIf: false }],
        "no-empty": "error",
        "no-empty-function": ["error", { allow: ["arrowFunctions"] }],
        "no-empty-static-block": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-boolean-cast": [
            "error",
            { enforceForInnerExpressions: true },
        ],
        "no-extra-label": "error",
        "no-global-assign": "error",
        "no-implicit-coercion": ["error", { disallowTemplateShorthand: true }],
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-inline-comments": ["error", { ignorePattern: "@type" }],
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-loop-func": "error",
        "no-magic-numbers": "off",
        "no-multi-assign": "error",
        "no-multi-str": "error",
        "no-negated-condition": "error",
        "no-nested-ternary": "off",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-nonoctal-decimal-escape": "error",
        "no-object-constructor": "error",
        "no-octal": "error",
        "no-octal-escape": "error",
        "no-param-reassign": [
            "error",
            {
                props: true,
                ignorePropertyModificationsFor: ["input"],
            },
        ],
        "no-plusplus": "off",
        "no-proto": "error",
        "no-redeclare": "error",
        "no-regex-spaces": "error",
        "no-restricted-exports": "off",
        "no-restricted-globals": "off",
        "no-restricted-imports": "off",
        "no-restricted-properties": "off",
        "no-restricted-syntax": [
            "error",
            "DebuggerStatement",
            "EmptyStatement",
            "ForInStatement",
            "LabeledStatement",
            "SequenceExpression",
            "WithStatement",
            "YieldExpression",
            "JSXIdentifier",
            "JSXNamespacedName",
            "JSXMemberExpression",
            "JSXEmptyExpression",
            "JSXExpressionContainer",
            "JSXElement",
            "JSXClosingElement",
            "JSXOpeningElement",
            "JSXAttribute",
            "JSXSpreadAttribute",
            "JSXText",
        ],
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-sequences": ["error", { allowInParentheses: false }],
        "no-shadow": "error",
        "no-shadow-restricted-names": "error",
        "no-ternary": "off",
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-undefined": "off",
        "no-underscore-dangle": "error",
        "no-unneeded-ternary": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-escape": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-void": "error",
        "no-warning-comments": "warn",
        "no-with": "error",
        "object-shorthand": "error",
        "one-var": ["error", "never"],
        "operator-assignment": "error",
        // Désactiver cette règle qui peut avoir des conflits avec Prettier.
        // https://github.com/prettier/eslint-plugin-prettier/issues/65
        "prefer-arrow-callback": "off",
        "prefer-const": "error",
        "prefer-destructuring": "off",
        "prefer-exponentiation-operator": "error",
        // Désactiver cette règle et préférer regexp/prefer-named-capture-group.
        "prefer-named-capture-group": "off",
        "prefer-numeric-literals": "error",
        "prefer-object-has-own": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "off",
        radix: "error",
        "require-await": "error",
        "require-unicode-regexp": ["error", { requireFlag: "v" }],
        "require-yield": "error",
        "sort-imports": [
            "error",
            {
                // Ne pas trier les imports en fonction des variables et de leur
                // type, mais préférer un tri en fonction du fichier importé.
                ignoreDeclarationSort: true,
            },
        ],
        "sort-keys": "off",
        "sort-vars": "off",
        strict: ["error", "never"],
        "symbol-description": "error",
        "vars-on-top": "off",
        yoda: ["error", "always"],

        // Layout & Formatting.
        "unicode-bom": "error",

        // Plugin eslint-plugin-array-func.
        "array-func/from-map": "error",
        "array-func/no-unnecessary-this-arg": "error",
        "array-func/prefer-array-from": "error",
        "array-func/avoid-reverse": "error",
        "array-func/prefer-flat-map": "error",
        "array-func/prefer-flat": "error",

        // Plugin eslint-plugin-eslint-comments.
        // Best Practices.
        "eslint-comments/disable-enable-pair": [
            "error",
            { allowWholeFile: true },
        ],
        "eslint-comments/no-aggregating-enable": "error",
        "eslint-comments/no-duplicate-disable": "error",
        "eslint-comments/no-unlimited-disable": "error",
        "eslint-comments/no-unused-disable": "error",
        "eslint-comments/no-unused-enable": "error",

        // Stylistic Issues.
        "eslint-comments/no-restricted-disable": "error",
        "eslint-comments/no-use": [
            "error",
            {
                allow: [
                    "eslint-disable",
                    "eslint-disable-next-line",
                    "eslint-enable",
                ],
            },
        ],
        "eslint-comments/require-description": "off",

        // Plugin eslint-plugin-import.
        // Helpful warnings.
        "import/export": "error",
        "import/no-deprecated": "error",
        "import/no-empty-named-blocks": "error",
        "import/no-extraneous-dependencies": [
            "error",
            {
                devDependencies: [
                    ".script/**/*.js",
                    "test/**/*.js",
                    "{.,}**/{.,}*.config.js",
                ],
            },
        ],
        "import/no-mutable-exports": "error",
        "import/no-named-as-default": "off",
        "import/no-named-as-default-member": "off",
        // Ne pas appliquer cette règle, car elle ne fonctionne pas quand le nom
        // du fichier de configuration de ESLint n'est pas standard.
        // https://github.com/import-js/eslint-plugin-import/issues/2678
        "import/no-unused-modules": "off",

        // Module systems.
        // Désactiver cette règle et laisser la règle no-undef remonter les
        // erreurs, car les méthodes define() et require() ne sont pas définies.
        "import/no-amd": "off",
        // Désactiver cette règle et préférer unicorn/prefer-module.
        "import/no-commonjs": "off",
        "import/no-import-module-exports": "off",
        "import/no-nodejs-modules": "error",
        "import/unambiguous": "off",

        // Static analysis.
        "import/default": "error",
        // Préférer la règle n/prefer-node-protocol.
        "import/enforce-node-protocol-usage": "off",
        "import/named": "error",
        "import/namespace": "error",
        "import/no-absolute-path": "error",
        "import/no-cycle": ["error", { ignoreExternal: true }],
        // Désactiver cette règle, car la méthode require() est déjà interdite.
        "import/no-dynamic-require": "off",
        "import/no-internal-modules": "off",
        "import/no-relative-packages": "error",
        "import/no-relative-parent-imports": "off",
        "import/no-restricted-paths": "off",
        "import/no-self-import": "error",
        "import/no-unresolved": ["error", { caseSensitiveStrict: true }],
        "import/no-useless-path-segments": "error",
        "import/no-webpack-loader-syntax": "error",

        // Style guide.
        // Ne pas activer cette règle qui s'applique seulement à Flow et
        // TypeScript.
        "import/consistent-type-specifier-style": "off",
        // Ne pas activer cette règle qui est utile seulement avec webpack.
        "import/dynamic-import-chunkname": "off",
        "import/exports-last": "off",
        "import/extensions": ["error", "ignorePackages"],
        "import/first": "error",
        "import/group-exports": "off",
        "import/max-dependencies": "off",
        "import/newline-after-import": [
            "error",
            {
                // Ne pas activer ces options, car les commentaires entre les
                // imports ne sont pas gérés.
                // https://github.com/import-js/eslint-plugin-import/issues/2673
                exactCount: false,
                considerComments: false,
            },
        ],
        "import/no-anonymous-default-export": [
            "error",
            {
                allowArray: true,
                allowCallExpression: false,
                allowObject: true,
            },
        ],
        "import/no-default-export": "off",
        "import/no-duplicates": "error",
        "import/no-named-default": "error",
        "import/no-named-export": "off",
        "import/no-namespace": "off",
        "import/no-unassigned-import": "error",
        "import/order": [
            "error",
            {
                "newlines-between": "never",
                alphabetize: { order: "asc" },
            },
        ],
        "import/prefer-default-export": "off",

        // Plugin eslint-plugin-jsdoc.
        "jsdoc/check-access": "error",
        "jsdoc/check-alignment": "error",
        // Désactiver cette règle, car elle n'est pas pour le moment compatible
        // avec ESLint 8.
        // https://github.com/gajus/eslint-plugin-jsdoc/releases/tag/v37.0.0
        "jsdoc/check-examples": "off",
        "jsdoc/check-indentation": "off",
        "jsdoc/check-line-alignment": [
            "error",
            "always",
            {
                tags: ["param", "prop"],
                customSpacings: {
                    postDelimiter: 1,
                    postTag: 1,
                },
            },
        ],
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/check-syntax": "error",
        "jsdoc/check-tag-names": "error",
        "jsdoc/check-template-names": "error",
        "jsdoc/check-types": "error",
        "jsdoc/check-values": "error",
        "jsdoc/convert-to-jsdoc-comments": "off",
        "jsdoc/empty-tags": "error",
        "jsdoc/implements-on-classes": "error",
        // Désactiver la règle, car elle ne supporte pas la propriété "exports".
        // https://github.com/gajus/eslint-plugin-jsdoc/issues/1114
        "jsdoc/imports-as-dependencies": "off",
        "jsdoc/informative-docs": "error",
        // Désactiver cette règle et laisser Prettier gérer le formatage.
        "jsdoc/lines-before-block": "off",
        "jsdoc/match-description": ["error", { matchDescription: "[A-ZÉ].*" }],
        "jsdoc/match-name": "off",
        "jsdoc/multiline-blocks": "error",
        "jsdoc/no-bad-blocks": "error",
        "jsdoc/no-blank-block-descriptions": "error",
        "jsdoc/no-blank-blocks": "error",
        "jsdoc/no-defaults": "error",
        "jsdoc/no-missing-syntax": "off",
        "jsdoc/no-multi-asterisks": "error",
        "jsdoc/no-restricted-syntax": "off",
        "jsdoc/no-types": "off",
        "jsdoc/no-undefined-types": "error",
        "jsdoc/require-asterisk-prefix": "error",
        "jsdoc/require-description": "error",
        "jsdoc/require-description-complete-sentence": "off",
        "jsdoc/require-example": "off",
        "jsdoc/require-file-overview": "off",
        "jsdoc/require-hyphen-before-param-description": ["error", "never"],
        "jsdoc/require-jsdoc": "error",
        "jsdoc/require-param": [
            "error",
            {
                checkRestProperty: true,
                checkGetters: true,
                checkSetters: true,
                checkDestructuredRoots: true,
            },
        ],
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param-name": "error",
        "jsdoc/require-param-type": "error",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-description": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-property-type": "error",
        "jsdoc/require-returns": "off",
        "jsdoc/require-returns-check": "error",
        "jsdoc/require-returns-description": "error",
        "jsdoc/require-returns-type": "error",
        "jsdoc/require-template": "error",
        "jsdoc/require-throws": "error",
        "jsdoc/require-yields": "error",
        "jsdoc/require-yields-check": "error",
        "jsdoc/sort-tags": "error",
        "jsdoc/tag-lines": ["error", "never", { startLines: 1 }],
        "jsdoc/text-escaping": "off",
        "jsdoc/valid-types": "error",

        // Plugin eslint-plugin-no-unsanitized.
        "no-unsanitized/method": "error",
        "no-unsanitized/property": "error",

        // Plugin eslint-plugin-promise.
        "promise/always-return": "off",
        "promise/avoid-new": "off",
        "promise/catch-or-return": "off",
        "promise/no-callback-in-promise": "error",
        "promise/no-multiple-resolved": "error",
        "promise/no-native": "off",
        "promise/no-nesting": "error",
        "promise/no-new-statics": "error",
        "promise/no-promise-in-callback": "error",
        "promise/no-return-in-finally": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/prefer-await-to-callbacks": "off",
        "promise/prefer-await-to-then": ["error", { strict: true }],
        "promise/prefer-catch": "error",
        "promise/spec-only": "error",
        "promise/valid-params": "error",

        // Plugin eslint-plugin-regexp.
        // Possible Errors.
        "regexp/no-contradiction-with-assertion": "error",
        "regexp/no-control-character": "error",
        "regexp/no-dupe-disjunctions": "error",
        "regexp/no-empty-alternative": "error",
        "regexp/no-empty-capturing-group": "error",
        "regexp/no-empty-character-class": "error",
        "regexp/no-empty-group": "error",
        "regexp/no-empty-lookarounds-assertion": "error",
        "regexp/no-escape-backspace": "error",
        "regexp/no-invalid-regexp": "error",
        "regexp/no-lazy-ends": "error",
        "regexp/no-misleading-capturing-group": "error",
        "regexp/no-misleading-unicode-character": "error",
        "regexp/no-missing-g-flag": "error",
        "regexp/no-optional-assertion": "error",
        "regexp/no-potentially-useless-backreference": "error",
        "regexp/no-super-linear-backtracking": "error",
        "regexp/no-super-linear-move": "error",
        "regexp/no-useless-assertions": "error",
        "regexp/no-useless-backreference": "error",
        "regexp/no-useless-dollar-replacements": "error",
        "regexp/strict": "error",

        // Best Practices.
        "regexp/confusing-quantifier": "error",
        "regexp/control-character-escape": "error",
        "regexp/negation": "error",
        "regexp/no-dupe-characters-character-class": "error",
        "regexp/no-empty-string-literal": "error",
        "regexp/no-extra-lookaround-assertions": "error",
        "regexp/no-invisible-character": "error",
        "regexp/no-legacy-features": "error",
        "regexp/no-non-standard-flag": "error",
        "regexp/no-obscure-range": "error",
        "regexp/no-octal": "error",
        "regexp/no-standalone-backslash": "error",
        "regexp/no-trivially-nested-assertion": "error",
        "regexp/no-trivially-nested-quantifier": "error",
        "regexp/no-unused-capturing-group": "error",
        "regexp/no-useless-character-class": "error",
        "regexp/no-useless-flag": "error",
        "regexp/no-useless-lazy": "error",
        "regexp/no-useless-quantifier": "error",
        "regexp/no-useless-range": "error",
        "regexp/no-useless-set-operand": "error",
        "regexp/no-useless-string-literal": "error",
        "regexp/no-useless-two-nums-quantifier": "error",
        "regexp/no-zero-quantifier": "error",
        "regexp/optimal-lookaround-quantifier": "error",
        "regexp/optimal-quantifier-concatenation": "error",
        "regexp/prefer-escape-replacement-dollar-char": "error",
        "regexp/prefer-predefined-assertion": "error",
        "regexp/prefer-quantifier": "error",
        "regexp/prefer-range": "error",
        "regexp/prefer-regexp-exec": "error",
        "regexp/prefer-regexp-test": "error",
        "regexp/prefer-set-operation": "error",
        // Désactiver cette règle qui est quasi-identique à la règle
        // "require-unicode-regexp" (seule la position de la notification est
        // différente).
        "regexp/require-unicode-regexp": "off",
        "regexp/simplify-set-operations": "error",
        "regexp/sort-alternatives": "error",
        "regexp/use-ignore-case": "error",

        // Stylistic Issues.
        "regexp/grapheme-string-literal": "error",
        "regexp/hexadecimal-escape": "off",
        "regexp/letter-case": [
            "error",
            {
                unicodeEscape: "uppercase",
                hexadecimalEscape: "uppercase",
            },
        ],
        "regexp/match-any": "error",
        "regexp/no-useless-escape": "error",
        "regexp/no-useless-non-capturing-group": "error",
        "regexp/prefer-character-class": "error",
        "regexp/prefer-d": ["error", { insideCharacterClass: "range" }],
        "regexp/prefer-lookaround": "error",
        "regexp/prefer-named-backreference": "error",
        "regexp/prefer-named-capture-group": "error",
        "regexp/prefer-named-replacement": "error",
        "regexp/prefer-plus-quantifier": "error",
        "regexp/prefer-question-quantifier": "error",
        "regexp/prefer-result-array-groups": "error",
        "regexp/prefer-star-quantifier": "error",
        "regexp/prefer-unicode-codepoint-escapes": "error",
        "regexp/prefer-w": "error",
        "regexp/sort-character-class-elements": "error",
        "regexp/sort-flags": "error",
        "regexp/unicode-escape": "error",
        "regexp/unicode-property": "error",

        // Plugin eslint-plugin-unicorn.
        "unicorn/better-regex": "error",
        "unicorn/catch-error-name": ["error", { ignore: [/^err$/v, /^e$/v] }],
        "unicorn/consistent-assert": "error",
        "unicorn/consistent-date-clone": "error",
        "unicorn/consistent-destructuring": "error",
        "unicorn/consistent-empty-array-spread": "error",
        "unicorn/consistent-existence-index-check": "error",
        "unicorn/consistent-function-scoping": "error",
        "unicorn/custom-error-definition": "error",
        // Laisser Prettier gérer cette règle.
        "unicorn/empty-brace-spaces": "off",
        "unicorn/error-message": "error",
        "unicorn/escape-case": "error",
        "unicorn/expiring-todo-comments": "off",
        "unicorn/explicit-length-check": "off",
        "unicorn/filename-case": "error",
        "unicorn/import-style": "error",
        "unicorn/new-for-builtins": "error",
        "unicorn/no-abusive-eslint-disable": "error",
        "unicorn/no-accessor-recursion": "error",
        "unicorn/no-anonymous-default-export": "error",
        "unicorn/no-array-callback-reference": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/no-array-method-this-argument": "error",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-array-reverse": "error",
        "unicorn/no-await-expression-member": "error",
        "unicorn/no-await-in-promise-methods": "error",
        "unicorn/no-console-spaces": "error",
        "unicorn/no-document-cookie": "error",
        "unicorn/no-empty-file": "error",
        "unicorn/no-for-loop": "error",
        "unicorn/no-hex-escape": "error",
        "unicorn/no-instanceof-builtins": "error",
        "unicorn/no-invalid-fetch-options": "error",
        "unicorn/no-invalid-remove-event-listener": "error",
        "unicorn/no-keyword-prefix": "error",
        "unicorn/no-lonely-if": "error",
        "unicorn/no-magic-array-flat-depth": "error",
        "unicorn/no-named-default": "error",
        // Utiliser la règle no-negated-condition d'ESLint, car celle d'unicorn
        // apporte seulement la correction automatique.
        "unicorn/no-negated-condition": "off",
        "unicorn/no-negation-in-equality-check": "error",
        "unicorn/no-nested-ternary": "off",
        "unicorn/no-new-array": "error",
        "unicorn/no-new-buffer": "error",
        "unicorn/no-null": "error",
        "unicorn/no-object-as-default-parameter": "error",
        "unicorn/no-process-exit": "error",
        "unicorn/no-single-promise-in-promise-methods": "error",
        "unicorn/no-static-only-class": "error",
        "unicorn/no-thenable": "error",
        "unicorn/no-this-assignment": "error",
        "unicorn/no-typeof-undefined": [
            "error",
            { checkGlobalVariables: true },
        ],
        "unicorn/no-unnecessary-array-flat-depth": "error",
        "unicorn/no-unnecessary-array-splice-count": "error",
        "unicorn/no-unnecessary-await": "error",
        "unicorn/no-unnecessary-polyfills": "error",
        "unicorn/no-unnecessary-slice-end": "error",
        "unicorn/no-unreadable-array-destructuring": "error",
        "unicorn/no-unreadable-iife": "error",
        "unicorn/no-unused-properties": "error",
        "unicorn/no-useless-error-capture-stack-trace": "error",
        "unicorn/no-useless-fallback-in-spread": "error",
        "unicorn/no-useless-length-check": "error",
        "unicorn/no-useless-promise-resolve-reject": "error",
        "unicorn/no-useless-spread": "error",
        "unicorn/no-useless-switch-case": "error",
        "unicorn/no-useless-undefined": "off",
        "unicorn/no-zero-fractions": "error",
        // Laisser Prettier gérer cette règle.
        "unicorn/number-literal-case": "off",
        "unicorn/numeric-separators-style": "error",
        "unicorn/prefer-add-event-listener": "error",
        "unicorn/prefer-array-find": "error",
        "unicorn/prefer-array-flat": "error",
        "unicorn/prefer-array-flat-map": "error",
        "unicorn/prefer-array-index-of": "error",
        "unicorn/prefer-array-some": "error",
        "unicorn/prefer-at": "error",
        "unicorn/prefer-blob-reading-methods": "error",
        "unicorn/prefer-class-fields": "error",
        "unicorn/prefer-code-point": "error",
        "unicorn/prefer-date-now": "error",
        "unicorn/prefer-default-parameters": "error",
        "unicorn/prefer-dom-node-append": "error",
        "unicorn/prefer-dom-node-dataset": "error",
        "unicorn/prefer-dom-node-remove": "error",
        "unicorn/prefer-dom-node-text-content": "error",
        "unicorn/prefer-event-target": "error",
        "unicorn/prefer-export-from": ["error", { ignoreUsedVariables: true }],
        "unicorn/prefer-global-this": "error",
        "unicorn/prefer-import-meta-properties": "error",
        "unicorn/prefer-includes": "error",
        "unicorn/prefer-json-parse-buffer": "off",
        "unicorn/prefer-keyboard-event-key": "error",
        "unicorn/prefer-logical-operator-over-ternary": "error",
        "unicorn/prefer-math-min-max": "error",
        "unicorn/prefer-math-trunc": "error",
        "unicorn/prefer-modern-dom-apis": "error",
        "unicorn/prefer-modern-math-apis": "error",
        "unicorn/prefer-module": "error",
        "unicorn/prefer-native-coercion-functions": "error",
        "unicorn/prefer-negative-index": "error",
        // Désactiver cette règle et préférer la règle "n/prefer-node-protocol".
        "unicorn/prefer-node-protocol": "off",
        "unicorn/prefer-number-properties": "error",
        "unicorn/prefer-object-from-entries": "error",
        "unicorn/prefer-optional-catch-binding": "error",
        "unicorn/prefer-prototype-methods": "error",
        "unicorn/prefer-query-selector": "error",
        "unicorn/prefer-reflect-apply": "error",
        "unicorn/prefer-regexp-test": "error",
        "unicorn/prefer-set-has": "error",
        "unicorn/prefer-set-size": "error",
        "unicorn/prefer-single-call": "error",
        "unicorn/prefer-spread": "off",
        "unicorn/prefer-string-raw": "error",
        "unicorn/prefer-string-replace-all": "error",
        "unicorn/prefer-string-slice": "error",
        "unicorn/prefer-string-starts-ends-with": "error",
        "unicorn/prefer-string-trim-start-end": "error",
        "unicorn/prefer-structured-clone": "error",
        "unicorn/prefer-switch": "off",
        "unicorn/prefer-ternary": "off",
        "unicorn/prefer-top-level-await": "error",
        "unicorn/prefer-type-error": "error",
        "unicorn/prevent-abbreviations": "off",
        "unicorn/relative-url-style": "error",
        "unicorn/require-array-join-separator": "off",
        "unicorn/require-module-specifiers": "error",
        "unicorn/require-number-to-fixed-digits-argument": "off",
        // Désactiver cette règle, car il y a des faux-positifs avec la méthode
        // port.postMessage() des WebExtensions.
        // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1396
        "unicorn/require-post-message-target-origin": "off",
        "unicorn/string-content": "off",
        "unicorn/switch-case-braces": ["error", "avoid"],
        "unicorn/template-indent": [
            "error",
            // Configurer la règle pour qu'elle soit compatible avec Prettier.
            // https://github.com/prettier/eslint-config-prettier#unicorntemplate-indent
            {
                tags: ["outdent", "dedent", "sql", "styled"],
                functions: ["dedent", "stripIndent"],
                selectors: [],
                comments: ["indent"],
            },
        ],
        "unicorn/text-encoding-identifier-case": "error",
        "unicorn/throw-new-error": "error",
    },

    settings: {
        jsdoc: {
            preferredTypes: {
                ".<>": "<>",
                "Array<>": "[]",
                object: "Object",
                "object<>": "Object<>",
            },
            tagNamePreference: {
                virtual: "abstract",
                extends: "augments",
                constructor: "class",
                const: "constant",
                defaultvalue: "default",
                desc: "description",
                host: "external",
                fileoverview: "file",
                overview: "file",
                emits: "fires",
                func: "function",
                method: "function",
                var: "member",
                arg: "param",
                argument: "param",
                property: "prop",
                return: "returns",
                exception: "throws",
                yield: "yields",
                linkcode: "link",
                linkplain: "link",
            },
        },
    },
};
