/**
 * @module
 */

import InitScriptPlugin from "../../meta/initscriptplugin.js";

export default class UserAgent extends InitScriptPlugin {
    getScript(browserContext) {
        if ("chromium" === browserContext.browser().browserType().name() &&
                browserContext.browser().isHeadless()) {
            return Promise.resolve(() => {
                Ghost.defineProperty(
                    Object.getPrototypeOf(navigator),
                    "userAgent",
                    { get: (nativeFn) => nativeFn().replace("Headless", "") },
                );

                Ghost.defineProperty(
                    Object.getPrototypeOf(navigator),
                    "appVersion",
                    { get: (nativeFn) => nativeFn().replace("Headless", "") },
                );
            });
        }

        return Promise.resolve();
    }
}
