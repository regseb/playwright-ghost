/**
 * @module
 */

export default class BrowserType {
    static mandatory = true;

    async BrowserType_launch_after(browserPromise, browserType) {
        const browser = await browserPromise;
        browser.browserType = () => browserType;

        return browser;
    }
}
