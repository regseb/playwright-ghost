/**
 * @module
 */

import InitScriptPlugin from "../../meta/initscriptplugin.js";

export default class Screen extends InitScriptPlugin {
    getScript(browserContext) {
        return Promise.resolve(() => {
            const sizes = {
                availTop:     27,
                availLeft:    45,
                borderWidth:  0,
                borderHeight: 72,
            };

            Ghost.defineProperty(window.screen, "availTop", {
                value: sizes.availTop,
            });
            Ghost.defineProperty(window.screen, "availLeft", {
                value: sizes.availLeft,
            });

            Ghost.defineProperty(window.screen, "availWidth", {
                value: window.screen.width - window.screen.availLeft,
            });
            Ghost.defineProperty(window.screen, "availHeight", {
                value: window.screen.height - window.screen.availTop,
            });

            window.outerWidth = window.screen.availWidth;
            window.outerHeight = window.screen.availHeight;

            window.innerWidtht = window.outerWidtht - sizes.borderWidth;
            window.innerHeight = window.outerHeight - sizes.borderHeight;
        });
    }
}
