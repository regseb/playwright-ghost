/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

const useAngle = (options, browserType) => {
    if ("chromium" === browserType.name() && (options?.headless ?? true)) {
        return {
            ...options,
            args: ["--use-angle", ...(options?.args ?? [])],
        };
    }
    return options;
};

/**
 * Crée un plugin pour modifier les valeurs des paramètres <em>WebGL</em> en
 * mode <em>headless</em>.
 */
export default function webGLPlugin() {
    return {
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            return [useAngle(args[0], browserType)];
        },

        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType },
        ) => {
            return [args[0], useAngle(args[1], browserType)];
        },
    };
}
