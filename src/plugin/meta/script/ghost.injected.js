let CHAIN_CYCLE_ERROR_MESSAGE;
try {
    Object.setPrototypeOf(Object.prototype.constructor,
                          Object.prototype.constructor);
} catch (err) {
    CHAIN_CYCLE_ERROR_MESSAGE = err.message;
}
const TO_STRING_TO_STRING = Function.prototype.toString.toString();

const Ghost = {
    defineProperty(obj, prop, descriptor) {
        const ownPropertyDescriptor = Object.getOwnPropertyDescriptor(
            obj,
            prop,
        );
        const handler = {
            ...ownPropertyDescriptor,
            ...descriptor,
        };

        if ("get" in descriptor) {
            const nativeFn = ownPropertyDescriptor.get;
            handler.get = function get() {
                return descriptor.get.call(this, nativeFn.bind(this));
            };
            Ghost.defineProperty(handler.get, "name", {
                value: nativeFn.name,
            });
            //nativeToStrings.set(handler.get, nativeFn.toString());
            Ghost.redirectToString(handler.get, nativeFn.toString());
        }

        if ("set" in descriptor) {
            const nativeFn = ownPropertyDescriptor.set;
            handler.set = function set(newValue) {
                descriptor.set.call(this, newValue, nativeFn.bind(this));
            };
            handler.set.name = nativeFn.name;
            //nativeToStrings.set(handler.set, nativeFn.toString());
            Ghost.redirectToString(handler.set, nativeFn.toString());
        }

        return Object.defineProperty(obj, prop, handler);
    },

    redirectToString(obj, originalToString) {
        const nativeFn = Function.prototype.toString;
        Ghost.defineProperty(Function.prototype, "toString", {
            value: Ghost.proxify(Function.prototype.toString, {
                apply(target, thisArg, args) {
                    if (thisArg === Function.prototype.toString) {
                        return TO_STRING_TO_STRING;
                    }
                    if (obj === thisArg) {
                        return originalToString;
                    }
                    return Reflect.apply(nativeFn, thisArg, args);
                },
            }),
        });
    },

    conceal(obj, proto, handler = {}) {
        return Ghost.proxify(Object.create(proto, handler.properties), {
            get: (target, prop) => {
                return prop in obj ? Reflect.get(obj, prop)
                                   : Reflect.get(target, prop);
            },
            ...handler,
        });
    },

    stripProxyInStack(err) {
        // FIXME Gérer la stackTrace qui est différente sous Chromium.
        err.stack = err.stack.substring(err.stack.indexOf("\n") + 1);
        return err;
    },

    proxify(obj, handler = {}) {
        const handlerEnriched = {
            ...handler,
            setPrototypeOf(target, proto) {
                try {
                    // (Object.setPrototype(fn, fn) || fn.__proto__ = fn) ||
                    //     Object.setPrototypeOf(fn, Object.create(fn)
                    if (proto === this.proxy ||
                            Object.getPrototypeOf(proto) === this.proxy) {
                        throw new TypeError(CHAIN_CYCLE_ERROR_MESSAGE);
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
                    return "apply" in handler ? handler.apply(...arguments)
                                              : Reflect.apply(...arguments);
                } catch (err) {
                    throw Ghost.stripProxyInStack(err);
                }
            },
        };


        const proxy = new Proxy(obj, handlerEnriched);
        handlerEnriched.proxy = proxy;

        if ("apply" in handler && Function.prototype.toString !== obj) {
            Ghost.redirectToString(proxy, obj.toString());
        }

        return proxy;
    },
};

Ghost.defineProperty(Reflect, "setPrototypeOf", {
    value: Ghost.proxify(Reflect.setPrototypeOf, {
        apply(target, thisArg, args) {
            try {
                return Reflect.apply(target, thisArg, args);
            } catch {
                return false;
            }
        },
    }),
});
