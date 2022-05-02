/**
 * https://github.com/fingerprintjs/BotD
 */

const getAllPropertyNames = (obj) => {
    if (null === obj) {
        return [];
    }

    return [
        ...Object.getOwnPropertyNames(obj),
        ...getAllPropertyNames(Object.getPrototypeOf(obj)),
    ];
}


export default [
    // accelerometerPermission
    () => typeof DeviceMotionEvent,
    () => typeof DeviceMotionEvent.requestPermission,

    // appVersion
    // Ne pas collecter le navigator.appVersion car il est trop variable pour
    // servir de référence.

    // astcProfiles
    () => {
        const canvas = document.createElement("canvas");
        const webGL = canvas.getContext("webgl");
        const astc = webGL.getExtension("WEBGL_compressed_texture_astc");
        return astc.getSupportedProfiles().toString();
    },

    // backdropFilter
    () => CSS.supports("backdrop-filter", "blur(2px)"),

    // darkTheme
    () => matchMedia("(prefers-color-scheme: dark)").matches,

    // deviceMemory
    () => navigator.deviceMemory,

    // documentElementKeys
    () => document.documentElement.getAttributeNames(),

    // documentProperties
    () => getAllPropertyNames(document),

    // dpi
    () => matchMedia("(-webkit-min-device-pixel-ratio: 2)," +
                     " (min-device-pixel-ratio: 2)," +
                     " (min-resolution: 192dpi)").matches,

    // endian
    () => {
        const buf = new ArrayBuffer(4);
        new Uint32Array(buf)[0] = 0xaa000000;
        return new Uint8Array(buf)[0];
    },

    // errorFF
    () => {
        try {
            throw "foo";
        } catch (err) {
            try {
                err.toSource();
                return true;
            } catch {
                return false;
            }
        }
    },

    // errorTrace
    // Ne pas collecter la stack d'une erreur car elle est différente selon qui
    // appelle la méthode.


    // evalLength
    () => eval.toString(),

    // frequency
    () => {
        const now = () => performance.now() / 1000;
        const gcd = (a, b) => {
            if (a < 0.00000001) {
                return b;
            }
            if (a < b) {
                return gcd(b - Math.floor(b / a) * a, a);
            } else if (a === b) {
                return a;
            } else {
                return gcd(b, a);
            }
        };

        const x = now();
        let g = now() - x;
        for (let i = 0; i < 10; i++) {
            g = gcd(g, now() - x);
        }
        return Math.round(1 / g);
    },

    // hairlines
    () => {
        const div = document.createElement("div");
        div.style.border = ".5px dotted transparent";
        document.body.appendChild(div);
        const offsetHeight = div.offsetHeight;
        document.body.removeChild(div);
        return [devicePixelRatio, offsetHeight];
    },

    // hardwareConcurrency
    () => {
        const concurrency = navigator.hardwareConcurrency;
        if (typeof concurrency === "string") {
            const concurrencyInt = Number.parseInt(concurrency);
            return Number.isNaN(concurrencyInt) ? 1
                                                : concurrencyInt;
        }
        return concurrency;
    },

    // installTrigger
    () => InstallTrigger,

    // languages
    // Ne pas collecter les languages car ils sont trop variables.

    // mimeTypesConsistence
    () => Object.getPrototypeOf(navigator.mimeTypes) ===
                                                        MimeTypeArray.prototype,
    () => Array.from(navigator.mimeTypes).map((mimeType) => {
        return Object.getPrototypeOf(mimeType) === MimeType.prototype;
    }),

    // mimeTypesLength
    () => navigator.mimeTypes.length,

    // navigatorProperties
    () => getAllPropertyNames(navigator),

    // notificationPermissions
    async () => {
        const permission = await navigator.permissions.query({
            name: "notifications",
        });
        return [Notification.permission, permission.state];
    },

    // oscpu
    () => navigator.oscpu,

    // platform
    // Ne pas collecter la platform car elle est variable.

    // pluginsConsistence
    () => Object.getPrototypeOf(navigator.plugins) === PluginArray.prototype,
    () => Array.from(navigator.plugins).map((plugin) => {
        return Object.getPrototypeOf(plugin) === Plugin.prototype;
    }),

    // pluginsLength
    () => navigator.plugins.length,

    // productSub
    () => navigator.productSub,

    // rtt
    () => navigator.connection.rtt,

    // sab
    () => new SharedArrayBuffer(1).byteLength,

    // screen
    () => screen.width,
    () => screen.height,

    // sourceBuffer
    () => typeof SourceBuffer,
    () => typeof SourceBufferList,

    // timestamp
    // Ne pas collecter la date qui change à chaque seconde.

    // touch
    () => navigator.maxTouchPoints,
    () => navigator.msMaxTouchPoints,

    // userAgent
    // Ne pas collecter le userAgent qui est trop variable.

    // userAgentData
    // Ne pas collecter le userAgentData qui est trop variable.

    // vendor
    () => navigator.vendor,

    // webdriver
    () => navigator.webdriver,

    // webgl
    () => {
        const canvasElement = document.createElement('canvas')
        const webGLContext = canvasElement.getContext('webgl')
        const vendor = webGLContext.getParameter(webGLContext.VENDOR)
        const renderer = webGLContext.getParameter(webGLContext.RENDERER)
        const version = webGLContext.getParameter(webGLContext.VERSION)
        if (InstallTrigger !== undefined) {
            return [vendor, renderer, version]
        }
        const webGLDebugInfo = webGLContext.getExtension('WEBGL_debug_renderer_info')
        const unmaskedVendor = webGLContext.getParameter(webGLDebugInfo.UNMASKED_VENDOR_WEBGL)
        const unmaskedRenderer = webGLContext.getParameter(webGLDebugInfo.UNMASKED_RENDERER_WEBGL)
        return [unmaskedVendor, unmaskedRenderer, vendor, renderer, version]
    },

    // windowClose
    () => close.toString(),

    // windowExternal
    () => external.toString(),

    // windowOuterSize
    () => outerWidth,
    () => outerHeight,

    // windowProperties
    () => getAllPropertyNames(window),
];
