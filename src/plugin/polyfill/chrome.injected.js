/**
 * @module
 * @see https://developer.chrome.com/blog/chrome-loadtimes-deprecated/
 * @see https://github.com/ulixee/secret-agent/blob/v1.6.5/plugins/default-browser-emulator/injected-scripts/window.chrome.ts
 * @see https://github.com/berstend/puppeteer-extra/tree/puppeteer-extra-plugin-stealth%402.9.0/packages/puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes
 * @see https://github.com/berstend/puppeteer-extra/tree/puppeteer-extra-plugin-stealth%402.9.0/packages/puppeteer-extra-plugin-stealth/evasions/chrome.csi
 * @see https://github.com/berstend/puppeteer-extra/tree/puppeteer-extra-plugin-stealth%402.9.0/packages/puppeteer-extra-plugin-stealth/evasions/chrome.app
 * @see https://github.com/berstend/puppeteer-extra/tree/puppeteer-extra-plugin-stealth%402.9.0/packages/puppeteer-extra-plugin-stealth/evasions/chrome.runtime
 */

const MathLocal = {
    trunc: Math.trunc.bind(Math),
};

const NumberLocal = {
    parseFloat: Number.parseFloat.bind(Number),
};

const performanceLocal = {
    now: window.performance.now.bind(window.performance),
};

const TIME_ORIGIN = window.performance.timeOrigin;

const ENTRIES = {
    NAVIGATION: window.performance.getEntriesByType("navigation")[0] ?? {
        domContentLoadedEventEnd: 0,
        loadEventEnd:             0,
        nextHopProtocol:          "h2",
        responseStart:            0,
        startTime:                0,
        type:                     "navigate",
    },

    PAINT: window.performance.getEntriesByName("first-paint", "paint")[0] ?? {
        startTime: 0,
    },
};

const convertTypeToNavigationType = (type) => {
    switch (type) {
        case "back_forward": return "BackForward";
        case "reload":       return "Reload";
        default:             return "Other";
    }
};

const convertTypeToTran = (type) => {
    switch (type) {
        case "back_forward": return 6;
        case "reload":       return 16;
        default:             return 15;
    }
};

const chrome = {
    // eslint-disable-next-line func-names, prefer-arrow-callback
    loadTimes: Ghost.patchToString(function () {
        return {
            requestTime: Math.trunc(TIME_ORIGIN +
                                    ENTRIES.NAVIGATION.startTime) / 1000,

            startLoadTime: Math.trunc(TIME_ORIGIN +
                                      ENTRIES.NAVIGATION.startTime) / 1000,

            commitLoadTime: Math.trunc(TIME_ORIGIN +
                                       ENTRIES.NAVIGATION.responseStart) / 1000,

            finishDocumentLoadTime: Math.trunc(
                TIME_ORIGIN + ENTRIES.NAVIGATION.domContentLoadedEventEnd,
            ) / 1000,

            finishLoadTime: Math.trunc(TIME_ORIGIN +
                                       ENTRIES.NAVIGATION.loadEventEnd) / 1000,

            firstPaintTime: Math.trunc(TIME_ORIGIN +
                                       ENTRIES.PAINT.startTime) / 1000,

            firstPaintAfterLoadTime: 0,

            navigationType: convertTypeToNavigationType(ENTRIES.NAVIGATION
                                                               .type),

            wasFetchedViaSpdy: ["h2", "hq"].includes(ENTRIES.NAVIGATION
                                                            .nextHopProtocol),

            wasNpnNegotiated: ["h2", "hq"].includes(ENTRIES.NAVIGATION
                                                           .nextHopProtocol),

            npnNegotiatedProtocol:
                    ["h2", "hq"].includes(ENTRIES.NAVIGATION.nextHopProtocol)
                                            ? ENTRIES.NAVIGATION.nextHopProtocol
                                            : "unknown",

            wasAlternateProtocolAvailable: false,

            connectionInfo: ENTRIES.NAVIGATION.nextHopProtocol,
        };
    }),

    // eslint-disable-next-line func-names, prefer-arrow-callback
    csi: Ghost.patchToString(function () {
        const now = performanceLocal.now();

        return {
            startE: Math.trunc(TIME_ORIGIN),

            onloadT: Math.trunc(TIME_ORIGIN +
                                ENTRIES.NAVIGATION.domContentLoadedEventEnd),

            // Récupérer deux chiffres à la fin du nombre (car performance.now()
            // retourne un nombre ayant le format "XXXX.X0000000XXXXX") pour
            // avoir trois chiffres après la virgule dans pageT.
            pageT: NumberLocal.parseFloat(
                now.toFixed(1) + (now * 100_000_000_000 % 100).toString(),
            ),

            tran: convertTypeToTran(ENTRIES.NAVIGATION.type),
        };
    }),

    app: {
        isInstalled: false,

        getDetails: Ghost.createLambdaWithName("getDetails", (...args) => {
            if (0 !== args.length) {
                throw new TypeError("Error in invocation of app.getDetails()");
            }
            // eslint-disable-next-line unicorn/no-null
            return null;
        }),

        getIsInstalled: Ghost.createLambdaWithName("getIsInstalled",
                                                   (...args) => {
            if (0 !== args.length) {
                throw new TypeError("Error in invocation of" +
                                    " app.getIsInstalled()");
            }
            return false;
        }),

        installState: Ghost.createLambdaWithName("installState",
                                                 (...args) => {
            if (1 !== args.length || !(args[0] instanceof Function)) {
                throw new TypeError("Error in invocation of" +
                                    " app.installState(function callback)");
            }
            return undefined;
        }),

        runningState: Ghost.createLambdaWithName("runningState", (...args) => {
            if (0 !== args.length) {
                throw new TypeError("Error in invocation of" +
                                    " app.runningState()");
            }
            return "cannot_run";
        }),

        InstallState: {
            DISABLED:      "disabled",
            INSTALLED:     "installed",
            NOT_INSTALLED: "not_installed",
        },

        RunningState: {
            CANNOT_RUN:   "cannot_run",
            READY_TO_RUN: "ready_to_run",
            RUNNING:      "running",
        },

    },
};

if ("https:" === location.protocol) {
    // FIXME
    chrome.runtime = {
        id: undefined,

        connect() {
            // TODO
        },

        sendMessage() {
            // TODO
        },

        OnInstalledReason: {
            CHROME_UPDATE:        "chrome_update",
            INSTALL:              "install",
            SHARED_MODULE_UPDATE: "shared_module_update",
            UPDATE:               "update",
        },

        OnRestartRequiredReason: {
            APP_UPDATE: "app_update",
            OS_UPDATE:  "os_update",
            PERIODIC:   "periodic",
        },

        PlatformArch: {
            ARM:    "arm",
            ARM64:  "arm64",
            MIPS:   "mips",
            MIPS64: "mips64",
            X86_32: "x86-32",
            X86_64: "x86-64",
        },

        PlatformNaclArch: {
            ARM:    "arm",
            MIPS:   "mips",
            MIPS64: "mips64",
            X86_32: "x86-32",
            X86_64: "x86-64",
        },

        PlatformOs: {
            ANDROID: "android",
            CROS:    "cros",
            LINUX:   "linux",
            MAC:     "mac",
            OPENBSD: "openbsd",
            WIN:     "win",
        },

        RequestUpdateCheckStatus: {
            NO_UPDATE:        "no_update",
            THROTTLED:        "throttled",
            UPDATE_AVAILABLE: "update_available",
        },
    };
}

Ghost.defineProperty(window, "chrome", {
    value: chrome,
}, { prototype: false, after: "Atomics" });
