/**
 * @module
 */

export default class DoNotTrack {
    BrowserType_launch_before(args, browserType) {
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
