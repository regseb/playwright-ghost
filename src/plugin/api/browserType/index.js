/**
 * @module
 */

export default class BrowserType {
    static mandatory = true;

    async BrowserType_launch_after(browserPromise, browserType) {
        const browser = await browserPromise;
        // Ajouter une méthode pour avoir le type du navigateur en attendant
        // qu'elle soit implémentée directement dans Playwright.
        // https://github.com/microsoft/playwright/issues/13882
        browser.browserType = () => browserType;

        return browser;
    }
}
