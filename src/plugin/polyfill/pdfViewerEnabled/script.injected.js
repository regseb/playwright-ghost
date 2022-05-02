if (navigator.userAgent.includes("Chrome")) {
    Ghost.defineProperty(
        Object.getPrototypeOf(navigator),
        "pdfViewerEnabled",
        { get() { return true; } },
    );
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
