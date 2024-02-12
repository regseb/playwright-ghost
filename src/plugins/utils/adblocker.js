/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @typedef {import("playwright").Page} Page
 */

const getBlocker = async function (options) {
    const { PlaywrightBlocker } = await import("@cliqz/adblocker-playwright");
    switch (options.mode) {
        case "parse":
            return PlaywrightBlocker.parse(options.filters, options.config);
        case "fromLists":
            return await PlaywrightBlocker.fromLists(
                options.fetch ?? fetch,
                options.urls,
                options.config,
            );
        case "fromPrebuiltAdsOnly":
            return await PlaywrightBlocker.fromPrebuiltAdsOnly(
                options.fetch ?? fetch,
            );
        case "fromPrebuiltAdsAndTracking":
            return await PlaywrightBlocker.fromPrebuiltAdsAndTracking(
                options.fetch ?? fetch,
            );
        case "fromPrebuiltFull":
            return await PlaywrightBlocker.fromPrebuiltFull(
                options.fetch ?? fetch,
            );
        default:
            throw new TypeError("invalid options");
    }
};

/**
 * Crée un plugin pour ajouter un bloqueur de publicité.
 *
 * @param {Object} [options] Les options du plugin.
 */
export default function adBlockerPlugin(options) {
    let blockerOptions;
    if (undefined === options) {
        blockerOptions = { mode: "fromPrebuiltAdsAndTracking" };
    } else if (options instanceof String) {
        blockerOptions = { mode: options };
    } else {
        blockerOptions = options;
    }

    return {
        "Page:new": async (page) => {
            const blocker = await getBlocker(blockerOptions);
            blocker.enableBlockingInPage(page);
            return page;
        },
    };
}
