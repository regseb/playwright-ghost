/**
 * @module
 */

import InitScriptPlugin from "../../meta/initscriptplugin.js";

export default class Webdriver extends InitScriptPlugin {
    getScript(browserContext) {
        if ("chromium" === browserContext.browser().browserType().name()) {
            return Promise.resolve(() => {
                Ghost.defineProperty(
                    Object.getPrototypeOf(navigator),
                    "webdriver",
                    { get: () => false },
                );
            });
        }
        return Promise.resolve();
    }
}
