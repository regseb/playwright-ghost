/**
 * @module
 */

import LEVELS from "../levels.js";
import Plugin from "../meta/plugin.js";

const Autoroute = class {

    #status = "CONTINUE";

    #error;

    #request = {
        headers: {},
    };

    #response;

    constructor(request, headers) {
        this.#request = {
            headers,
            method: request.method(),
            url:    request.url(),
        };
        if (null !== request.postData()) {
            this.#request.postData = request.postData();
        }
    }

    abort(errorCode) {
        this.#status = "ABORT";
        this.#error = errorCode;
    }

    continue(options) {
        this.#status = "CONTINUE";
        if (undefined !== options?.headers) {
            this.#request.headers = {
                ...this.#request.headers,
                ...options.headers,
            };
        }
        if (undefined !== options?.method) {
            this.#request.method = options.method;
        }
        if (undefined !== options?.postData) {
            this.#request.postData = options.postData;
        }
        if (undefined !== options?.url) {
            this.#request.url = options.url;
        }
    }

    fulfill(options) {
        this.#status = "FULFILL";
        this.#response = options;
    }

    status() {
        return this.#status;
    }

    error() {
        return this.#error;
    }

    request() {
        return this.#request;
    }

    response() {
        return this.#response;
    }
};

export default class RoutePlugin extends Plugin {
    static name = "api/route";

    static level = LEVELS.MANDATORY;

    constructor() {
        super();
        this.addListener("Browser.newContext:after",
                         this.#addRouteInContext.bind(this));
        this.addListener("BrowserContext.newPage:after",
                         this.#addRouteInPage.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #addRouteInContext(context) {
        context.routers = [];

        context.route = (url, handler, options) => {
            context.routers.push({ url, handler, options });
        };
        // TODO Implémenter context.unroute().

        return context;
    }

    // eslint-disable-next-line class-methods-use-this
    #addRouteInPage(page, { obj: context }) {
        page.route("**", async (route, request) => {
            const autoroute = new Autoroute(
                                     route.request(),
                                     await route.request().allHeaders(),
            );
            // https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/client/browserContext.ts#L146
            for (const router of page.routers) {
                // FIXME Vérifier le glob.
                if ("**" === router.url) {
                    await router.handler(autoroute, request);
                }
            }
            switch (autoroute.status) {
                case "ABORT": return route.abort(autoroute.error());
                case "FULFILL":
                    return route.fulfill(autoroute.response());
                default:
                    return route.continue(autoroute.request());
            }
        });

        page.routers = context.routers.slice();
        page.route = (url, handler, options) => {
            page.routers.push({
                url,
                handler,
                options: { ...options, page: true },
            });
        };
        // TODO Implémenter page.unroute().

        return page;
    }
}
