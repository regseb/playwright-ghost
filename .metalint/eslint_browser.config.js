export default {
    env: {
        browser: true,
    },

    globals: {
        // FIXME Ajouter cette variable globale dans globals.
        //       https://github.com/sindresorhus/globals/pull/196
        //       https://github.com/eslint/eslint/pull/16654
        //       https://github.com/eslint/eslintrc/pull/98
        WorkerNavigator: "readonly",
        Ghost: "readonly",
        ReflectLocal: "readonly",
        ObjectLocal: "readonly",
    },
};
