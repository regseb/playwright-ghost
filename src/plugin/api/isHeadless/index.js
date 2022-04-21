/**
 * @module
 */

export default class IsHeadless {
    static mandatory = true;

    async BrowserType_launch_after(browserPromise, _browserType, args) {
        const browser = await browserPromise;
        browser.isHeadless = function isHeadless() {
            return args[0]?.headless ?? true;
        };

        return browser;
    }
}
