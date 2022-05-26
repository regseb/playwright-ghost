/* global importMeta */
const options = importMeta.arguments;

window.outerHeight = options.outerHeight;
window.outerWidth = options.outerWidth;
window.screenX = options.screenX;
window.screenLeft = options.screenX;
window.screenY = options.screenY;
window.screenTop = options.screenY;

Ghost.defineProperties(Screen, {
    availHeight: {
        get() {
            return options.screen.availHeight;
        },
    },
    availLeft: {
        get() {
            return options.screen.availLeft;
        },
    },
    availTop: {
        get() {
            return options.screen.availTop;
        },
    },
    availWidth: {
        get() {
            return options.screen.availWidth;
        },
    },
    height: {
        get() {
            return options.screen.height;
        },
    },
    width: {
        get() {
            return options.screen.width;
        },
    },
});
