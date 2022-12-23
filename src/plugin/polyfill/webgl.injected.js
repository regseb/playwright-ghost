const DEBUG_INFO = document.createElement("canvas")
                           .getContext("webgl")
                           .getExtension("WEBGL_debug_renderer_info");
const DEBUG_INFO2 = document.createElement("canvas")
                            .getContext("webgl2")
                            .getExtension("WEBGL_debug_renderer_info");

Ghost.defineProperty(WebGLRenderingContext, "getParameter", {
    value(target, thisArg, args) {
        const native = Reflect.apply(target, thisArg, args);
        if (DEBUG_INFO.UNMASKED_VENDOR_WEBGL === args[0]) {
            return `Google Inc. (${native})`;
        }
        if (DEBUG_INFO.UNMASKED_RENDERER_WEBGL === args[0]) {
            const vendor = Reflect.apply(
                target,
                thisArg,
                [DEBUG_INFO.UNMASKED_VENDOR_WEBGL],
            );
            // FIXME Voir pour OpenGL
            return `ANGLE (${vendor}, ${native}, OpenGL 4.6)`;
        }
        return native;
    },
});

Ghost.defineProperty(WebGL2RenderingContext, "getParameter", {
    value(target, thisArg, args) {
        const native = Reflect.apply(target, thisArg, args);
        if (DEBUG_INFO2.UNMASKED_VENDOR_WEBGL === args[0]) {
            return `Google Inc. (${native})`;
        }
        if (DEBUG_INFO2.UNMASKED_RENDERER_WEBGL === args[0]) {
            const vendor = Reflect.apply(
                target,
                thisArg,
                [DEBUG_INFO.UNMASKED_VENDOR_WEBGL],
            );
            // FIXME Voir pour OpenGL
            return `ANGLE (${vendor}, ${native}, OpenGL 4.6)`;
        }
        return native;
    },
});
