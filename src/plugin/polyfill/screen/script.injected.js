const sizes = {
    availTop:     27,
    availLeft:    45,
    borderWidth:  0,
    borderHeight: 72,
};

Ghost.defineProperty(Object.getPrototypeOf(screen), "availTop", {
    get() { return sizes.availTop; },
});
Ghost.defineProperty(Object.getPrototypeOf(screen), "availLeft", {
    get() { return sizes.availLeft; },
});

Ghost.defineProperty(Object.getPrototypeOf(screen), "availWidth", {
    get() { return screen.width - screen.availLeft; },
});
Ghost.defineProperty(Object.getPrototypeOf(screen), "availHeight", {
    get() { return screen.height - screen.availTop; },
});

Ghost.defineProperty(window, "outerWidth", {
    get() { return screen.availWidth; },
});
Ghost.defineProperty(window, "outerHeight", {
    get() { return screen.availHeight; },
});

Ghost.defineProperty(window, "innerWidth", {
    get() { return outerWidth - sizes.borderWidth; },
});
Ghost.defineProperty(window, "innerHeight", {
    get() { return outerHeight - sizes.borderHeight; },
});
