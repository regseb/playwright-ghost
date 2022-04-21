/**
 * @module
 */

export default class BrowserType {
    static mandatory = true;

    async BrowserType_launch_after(browserPromise, browserType) {
        const browser = await browserPromise;
        // FIXME En ajouter un nom à la fonction, celle-ci retourne une
        //       fonction.
        browser.browserType = function () { return browserType; };

        return browser;
    }
}
