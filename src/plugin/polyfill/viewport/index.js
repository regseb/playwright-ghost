/**
 * @module
 */

export default class Viewport {
    Browser_newContext_before(args, browser) {
        if (browser.isHeadless()) {
            return [{
                viewport: {
                    width: 1536,
                    height: 864,
                    ...args[0]?.viewport,
                },
                ...args[0],
            }];
        }

        return args;
    }
}
