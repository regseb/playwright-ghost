/**
 * @module
 * @see https://developer.chrome.com/blog/chrome-loadtimes-deprecated/
 * @see https://github.com/ulixee/secret-agent/blob/v1.6.5/plugins/default-browser-emulator/injected-scripts/window.chrome.ts
 * @see https://github.com/berstend/puppeteer-extra/tree/puppeteer-extra-plugin-stealth%402.9.0/packages/puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes
 * @see https://github.com/berstend/puppeteer-extra/tree/puppeteer-extra-plugin-stealth%402.9.0/packages/puppeteer-extra-plugin-stealth/evasions/chrome.csi
 * @see https://github.com/berstend/puppeteer-extra/tree/puppeteer-extra-plugin-stealth%402.9.0/packages/puppeteer-extra-plugin-stealth/evasions/chrome.app
 * @see https://github.com/berstend/puppeteer-extra/tree/puppeteer-extra-plugin-stealth%402.9.0/packages/puppeteer-extra-plugin-stealth/evasions/chrome.runtime
 */

const TIME_ORIGIN = performance.timeOrigin;

const ENTRIES = {
    NAVIGATION: performance.getEntriesByType("navigation")[0] ?? {
        domContentLoadedEventEnd: 0,
        loadEventEnd:             0,
        nextHopProtocol:          "h2",
        responseStart:            0,
        startTime:                0,
        type:                     "navigate",
    },

    PAINT: performance.getEntriesByName("first-paint", "paint")[0] ?? {
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

const LOAD_TIMES = {
    requestTime: Math.trunc(TIME_ORIGIN + ENTRIES.NAVIGATION.startTime) / 1000,

    startLoadTime: Math.trunc(TIME_ORIGIN +
                              ENTRIES.NAVIGATION.startTime) / 1000,

    commitLoadTime: Math.trunc(TIME_ORIGIN +
                               ENTRIES.NAVIGATION.responseStart) / 1000,

    finishDocumentLoadTime: Math.trunc(TIME_ORIGIN +
                                       ENTRIES.NAVIGATION
                                              .domContentLoadedEventEnd) / 1000,

    finishLoadTime: Math.trunc(TIME_ORIGIN +
                               ENTRIES.NAVIGATION.loadEventEnd) / 1000,

    firstPaintTime: Math.trunc(TIME_ORIGIN + ENTRIES.PAINT.startTime) / 1000,

    firstPaintAfterLoadTime: 0,

    navigationType: convertTypeToNavigationType(ENTRIES.NAVIGATION.type),

    wasFetchedViaSpdy: ["h2", "hq"].includes(ENTRIES.NAVIGATION
                                                    .nextHopProtocol),

    wasNpnNegotiated: ["h2", "hq"].includes(ENTRIES.NAVIGATION.nextHopProtocol),

    npnNegotiatedProtocol:
            ["h2", "hq"].includes(ENTRIES.NAVIGATION.nextHopProtocol)
                                            ? ENTRIES.NAVIGATION.nextHopProtocol
                                            : "unknown",

    wasAlternateProtocolAvailable: false,

    connectionInfo: ENTRIES.NAVIGATION.nextHopProtocol,
};

const CSI = {
    startE: Math.trunc(TIME_ORIGIN),

    onloadT: Math.trunc(TIME_ORIGIN +
                        ENTRIES.NAVIGATION.domContentLoadedEventEnd),

    // Renseigner cette propriété à l'appel de la méthode csi() car la valeur
    // dépend de l'heure où la méthode a été appelée. Mais ajouter la propriété
    // pour qu'elle soit à la bonne position (avant "tran").
    pageT: undefined,

    tran: convertTypeToTran(ENTRIES.NAVIGATION.type),
};

const chrome = {
    // eslint-disable-next-line func-names, prefer-arrow-callback
    loadTimes: Ghost.patchToString(function () {
        // Créer une copie de l'objet car la méthode loadTimes() retourne un
        // nouvel objet à chaque appel.
        return { ...LOAD_TIMES };

    }),

    // eslint-disable-next-line func-names, prefer-arrow-callback
    csi: Ghost.patchToString(function () {
        const now = performance.now();

        return {
            ...CSI,
            // Récupérer deux chiffres à la fin du nombre (car performance.now()
            // retourne un nombre ayant le format "XXXX.X0000000XXXXX") pour
            // avoir trois chiffres après la virgule dans pageT.
            pageT: Math.trunc(now * 1000 +
                              now * 100_000_000_000 % 100) / 1000,
        };
    }),

    app: {
        isInstalled: false,

        getDetails: Ghost.createLambdaWithName("getDetails", (...args) => {
            if (0 !== args.length) {
                Ghost.throwError(TypeError,
                                 "Error in invocation of app.getDetails(): ");
            }
            // eslint-disable-next-line unicorn/no-null
            return null;
        }),

        getIsInstalled: Ghost.createLambdaWithName("getIsInstalled",
                                                   (...args) => {
            if (0 !== args.length) {
                Ghost.throwError(
                    TypeError,
                    "Error in invocation of app.getIsInstalled(): ",
                );
            }
            return false;
        }),

        installState: Ghost.createLambdaWithName("installState",
                                                 (...args) => {
            if (1 !== args.length || !(args[0] instanceof Function)) {
                Ghost.throwError(
                    TypeError,
                    "Error in invocation of" +
                        " app.installState(function callback): ",
                );
            }
            return undefined;
        }),

        runningState: Ghost.createLambdaWithName("runningState", (...args) => {
            if (0 !== args.length) {
                Ghost.throwError(
                    TypeError,
                    "Error in invocation of app.runningState(): ",
                );
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

Ghost.defineProperty(window, "chrome", {
    value: chrome,
}, { prototype: false, after: "Atomics" });
