if (navigator.userAgent.includes("Chrome")) {
    Ghost.defineProperty(
        Object.getPrototypeOf(navigator),
        "pdfViewerEnabled",
        { get() { return true; } },
    );
// FIXME En attendant que Playwright utiliser la version 99+ de Firefox.
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/pdfViewerEnabled#browser_compatibility
} else if (navigator.userAgent.includes("Firefox")) {
    Ghost.defineProperty(
        Object.getPrototypeOf(navigator),
        "pdfViewerEnabled",
        {
            configurable: true,
            enumerable: true,
            get() { return true; },
            set: undefined,
        },
    );
}
