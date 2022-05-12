/**
 * @module
 */

export default class DoNotTrack {
    BrowserType_launch_before(args, browserType) {
        // FIXME Tester quand Playwright utilisera Firefox 99 (pour
        // navigator.pdfViewerEnabled).
        if ("firefox" === browserType.name()) {
            return [{
                firefoxUserPrefs: {
                    "pdfjs.disabled": false,
                    ...args[0]?.firefoxUserPrefs,
                },
                ...args[0],
            }];
        }
        /*
        if ("firefox" === browserType.name()) {
            return [{
                firefoxUserPrefs: {
                    "privacy.donottrackheader.enabled": false,
                    ...args[0]?.firefoxUserPrefs,
                },
                ...args[0],
            }];
        }
*/
        return args;
    }
}
