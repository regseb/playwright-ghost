let CHAIN_CYCLE_ERROR_MESSAGE;
try {
    Object.setPrototypeOf(Object.prototype.constructor,
                          Object.prototype.constructor);
} catch (err) {
    CHAIN_CYCLE_ERROR_MESSAGE = err.message;
}

// Faire des copies des méthodes natives pour ne pas se faire détecter par un
// Antibot qui modifirait une méthode pour vérifier qu'elle n'est pas appelée.

const toStringMappings = new Map();

const Utils = {
    Array: {
        intersect(arr1, arr2) {
            return arr1.filter((e) => arr2.includes(e));
        },
    },
    Object: {
        getAllPropertyDescriptors(obj) {
            const proto = Object.getPrototypeOf(obj);
            if (null === proto) {
                return {};
            }
            return {
                ...this.getAllPropertyDescriptors(proto),
                ...Object.getOwnPropertyDescriptors(obj),
            };
        },
        getAllPropertyReadableNames(obj) {
            return Object.entries(this.getAllPropertyDescriptors(obj))
                         .filter(([_, d]) => undefined !== d.value ||
                                             undefined !== d.get)
                         .map(([n]) => n);
        },
        getAllPropertyWritableNames(obj) {
            return Object.entries(this.getAllPropertyDescriptors(obj))
                         .filter(([_, d]) => (undefined !== d.value &&
                                              d.writable) ||
                                             undefined !== d.set)
                         .map(([n]) => n);
        },
    },
};

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

        if (undefined !== handler.get) {
            const nativeFn = ownPropertyDescriptor?.get ?? (() => {});
            handlerEnriched.get = Ghost.proxify(nativeFn, {
                apply(target, thisArg) {
                    try {
                        nativeFn.call(thisArg);
                    } catch (err) {
                        // Dans Chromium.
                        if ("Illegal invocation" === err.message) {
                            throw err;
                        }
                        // Dans Firefox.
                        if ((/'[^']+' called on an object that does not implement interface [^\.]+/u).test(err.message)) {
                            throw err;
                        }
                    }
                    return handler.get.call(thisArg, nativeFn.bind(thisArg));
                },
            }, options);
        }

        if (undefined !== handler.set) {
            const nativeFn = ownPropertyDescriptor?.set ?? (() => {});
            handlerEnriched.set = Ghost.proxify(nativeFn, {
                apply(target, thisArg, args) {
                    return handler.set.call(
                        thisArg,
                        args[0],
                        nativeFn.bind(thisArg),
                    );
                },
            }, options);
        }

        return Object.defineProperty(obj, prop, handlerEnriched);
    },

    conceal(obj, proto, handler = {}, options = {}) {
        const props = {
            readable: Utils.Array.intersect(
                Utils.Object.getAllPropertyReadableNames(obj),
                Utils.Object.getAllPropertyReadableNames(proto),
            ).filter((p) => "constructor" !== p),
            writable: Utils.Array.intersect(
                Utils.Object.getAllPropertyWritableNames(obj),
                Utils.Object.getAllPropertyWritableNames(proto),
            ).filter((p) => "constructor" !== p),
        };

        const propertiesEnriched = {
            ...Object.getOwnPropertyDescriptors(obj),
            ...handler.properties,
        };
        const handlerEnriched = {
            set(target, prop, value) {
                return props.writable.includes(prop)
                                                 ? Reflect.set(obj, prop, value)
                                                 : Reflect.set(...arguments);
            },
            get(target, prop) {
                return props.readable.includes(prop)
                                                    ? Reflect.get(obj, prop)
                                                    : Reflect.get(...arguments);
            },
            ...handler,
        };

        return Ghost.proxify(Object.create(proto, propertiesEnriched),
                             handlerEnriched,
                             options);
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

            apply(target, thisArg, args, r) {
                try {
                    // Appliquer le proxy seulement sur l'objet souhaité (pour
                    // éviter le Navigator.prototype.plugins).
                    // return this.nativeThis === thisArg && "apply" in handler
                    return "apply" in handler
                                                  ? handler.apply(...arguments)
                                                  : Reflect.apply(...arguments);
                } catch (err) {
                    throw err;
                    throw Ghost.stripProxyInStack(err);
                }
            },

            get(target, prop) {
                // Ne pas tester "callee" (qui est dans le message d'erreur) car
                // les navigateurs retournent "undefined".
                if (target instanceof Function &&
                        ["caller", "arguments"].includes(prop)) {
                    throw new TypeError(
                        "'caller', 'callee', and 'arguments' properties may" +
                        " not be accessed on strict mode functions or the" +
                        " arguments objects for calls to them",
                    );
                }
                /*
                if ("toString" === prop) {
                    console.log(obj, obj.toString());
                    return obj.toString;
                }*/
                return "get" in handler ? handler.get(...arguments)
                                        : Reflect.get(...arguments);
            },
        };

        const proxy = new Proxy(obj, handlerEnriched);
        handlerEnriched.proxy = proxy;
        handlerEnriched.nativeThis = options.nativeThis ?? proxy;

        toStringMappings.set(proxy, obj.toString());

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

Ghost.defineProperty(Function.prototype, "toString", {
    ...Object.getOwnPropertyDescriptor(Function.prototype, "toString"),
    value: Ghost.proxify(Function.prototype.toString, {
        apply(target, thisArg, args) {
            return toStringMappings.has(thisArg) ? toStringMappings.get(thisArg)
                                                 : Reflect.apply(...arguments);
        },
    }),
});

