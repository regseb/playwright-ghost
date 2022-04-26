let CHAIN_CYCLE_ERROR_MESSAGE;
try {
    Object.setPrototypeOf(Object.prototype.constructor,
                          Object.prototype.constructor);
} catch (err) {
    CHAIN_CYCLE_ERROR_MESSAGE = err.message;
}

// FIXME A supprimer.
let count = 10;

// Faire des copies des méthodes natives pour ne pas se faire détecter par un
// Antibot qui modifirait une méthode pour vérifier qu'elle n'est pas appelée.

const Ghost = {
    defineProperty(obj, prop, handler, options) {
        const ownPropertyDescriptor = Object.getOwnPropertyDescriptor(
            obj,
            prop,
        );
        const handlerEnriched = {
            ...ownPropertyDescriptor,
            ...handler,
        };

        if ("get" in handler) {
            const nativeFn = ownPropertyDescriptor.get ?? Function;
            handlerEnriched.get = Ghost.proxify(nativeFn, {
                apply(target, thisArg) {
                    return handler.get.call(thisArg, nativeFn.bind(thisArg));
                },
            }, options);
        }

        if ("set" in handler) {
            const nativeFn = ownPropertyDescriptor.set;
            handlerEnriched.set = Ghost.proxify(nativeFn, {
                apply(target, thisArg, args) {
                    return handler.set.call(
                        thisArg,
                        args[0],
                        nativeFn.bind(thisArg),
                    );
                },
            }, ...options);
        }

        return Object.defineProperty(obj, prop, handlerEnriched);
    },

    conceal(obj, proto, handler = {}, options = {}) {
        return Ghost.proxify(Object.create(proto, handler.properties), {
            get(target, prop) {
                const props = Object.keys({
                    ...Object.getOwnPropertyDescriptors(obj),
                    ...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(
                                                                          obj)),
                });
                return props.includes(prop) ? Reflect.get(obj, prop)
                                            : Reflect.get(target, prop);
            },
            ...handler,
        }, options);
    },

    stripProxyInStack(err) {
        // FIXME Gérer la stackTrace qui est différente sous Chromium.
        err.stack = err.stack.substring(err.stack.indexOf("\n") + 1);
        return err;
    },

    proxify(obj, handler = {}, options = {}) {
        const handlerEnriched = {
            ...handler,
            setPrototypeOf(target, proto) {
                try {
                    // (Object.setPrototype(fn, fn) || fn.__proto__ = fn) ||
                    //     Object.setPrototypeOf(fn, Object.create(fn)
                    if (proto === this.proxy ||
                            Object.getPrototypeOf(proto) === this.proxy) {
                        if (options.isReflectSetPrototypeOf) {
                            return false;
                        } else {
                            throw new TypeError(CHAIN_CYCLE_ERROR_MESSAGE);
                        }
                    }
                    return "setPrototypeOf" in handler
                                         ? handler.setPrototypeOf(...arguments)
                                         : Reflect.setPrototypeOf(...arguments);
                } catch (err) {
                    throw Ghost.stripProxyInStack(err);
                }
            },
            apply(target, thisArg, args) {
                try {
                    // Appliquer le proxy seulement sur l'objet souhaité (pour
                    // éviter le Navigator.prototype.plugins).
                    return this.nativeThis === thisArg && "apply" in handler
                                                  ? handler.apply(...arguments)
                                                  : Reflect.apply(...arguments);
                } catch (err) {
                    throw err;
                    throw Ghost.stripProxyInStack(err);
                }
            },
            get(target, prop) {
                if (target instanceof Function &&
                        ["caller", "callee", "arguments"].includes(prop)) {
                    throw new TypeError(
                        "'caller', 'callee', and 'arguments' properties may" +
                        " not be accessed on strict mode functions or the" +
                        " arguments objects for calls to them",
                    );
                }
                if ("toString" === prop) {
                    return obj.toString;
                }
                return "get" in handler ? handler.get(...arguments)
                                        : Reflect.get(...arguments);
            },
        };

        const proxy = new Proxy(obj, handlerEnriched);
        handlerEnriched.proxy = proxy;
        handlerEnriched.nativeThis = options.nativeThis ?? proxy;

        if (Reflect.setPrototypeOf !== obj) {
            Ghost.defineProperty(Reflect, "setPrototypeOf", {
                value: Ghost.proxify(Reflect.setPrototypeOf, {
                    apply(target, thisArg, args) {
                        const proto = args[0];
                        // (Object.setPrototype(fn, fn) || fn.__proto__ = fn) ||
                        //     Object.setPrototypeOf(fn, Object.create(fn)
                        if (proto === proxy ||
                                Object.getPrototypeOf(proto) === proxy) {
                            return false;
                        }
                        return Reflect.apply(...arguments);
                    },
                }, { nativeThis: Reflect, isReflectSetPrototypeOf: true }),
            });
        }

        return proxy;
    },
};

/*
Ghost.defineProperty(Reflect, "setPrototypeOf", {
    value: Ghost.proxify(Reflect.setPrototypeOf, {
        apply(target, thisArg, args) {
            try {
                return Reflect.apply(target, thisArg, args);
            } catch (err) {
                // FIXME Ce code est détectable si un bot surcharger la méthode
                //       setPrototypeOf() et retourne une exception avec ce
                //       message.
                if (err instanceof TypeError &&
                        CHAIN_CYCLE_ERROR_MESSAGE === err.message) {
                    return false;
                } else {
                    throw err;
                }
            }
        },
    }, Reflect),
});
*/
