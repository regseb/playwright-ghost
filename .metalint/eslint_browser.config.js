export default {
    env: {
        browser: true,
    },
    globals: {
        // Faire une pull request pour ajouter cette variable dans le projet
        // https://github.com/sindresorhus/globals.
        NavigatorUAData: "readonly",
        Ghost: "readonly",
        ReflectLocal: "readonly",
        ObjectLocal: "readonly",
    },
};
