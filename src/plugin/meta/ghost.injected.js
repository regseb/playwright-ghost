/* global ReflectNative */

let CHAIN_CYCLE_ERROR_MESSAGE;
try {
    Object.setPrototypeOf(Object.prototype.constructor,
                          Object.prototype.constructor);
} catch (err) {
    CHAIN_CYCLE_ERROR_MESSAGE = err.message;
}

const toStringMappings = new Map();
const setPrototypeOfMappings = new Map();

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
                         .filter(([_, d]) => undefined !== d.value &&
                                             d.writable ||
                                             undefined !== d.set)
                         .map(([n]) => n);
        },
        getAllPrototypes(obj) {
            const protos = [];
            let proto = Object.getPrototypeOf(obj);
            while (null !== proto) {
                protos.push(proto);
                proto = Object.getPrototypeOf(proto);
            }
            return protos;
        },
    },
};

const Ghost = {
    defineProperty(clazz, prop, handler, options) {
        const prototype = options?.prototype ?? true;
        const obj = prototype ? clazz.prototype
                              : clazz;
        const instance = prototype ? clazz
                                   : undefined;

        const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
        const handlerEnriched = {
            ...descriptor,
            ...handler,
        };

        if (undefined !== handler.get && undefined !== descriptor?.get) {
            handlerEnriched.get = Ghost.proxify(descriptor.get, {
                apply: handler.get,
            }, { instance });
        }

        if (undefined !== handler.set && undefined !== descriptor?.set) {
            handlerEnriched.set = Ghost.proxify(descriptor.set, {
                apply: handler.set,
            }, { instance });
        }

        if (undefined !== handler.value && undefined !== descriptor?.value) {
            handlerEnriched.value = Ghost.proxify(descriptor.value, {
                apply: handler.value,
            }, { instance });
        }

        let result;
        if (undefined === descriptor) {
            // Enlever les propriétés qui doivent être après la nouvelle
            // propriété.
            const backup = {};
            const names = Object.getOwnPropertyNames(clazz);
            for (const name of names.slice(names.indexOf(options.after) + 1)) {
                backup[name] = Object.getOwnPropertyDescriptor(clazz, name);
                // FIXME Voir pour utiliser obj à place de clazz.
                delete clazz[name];
            }

            result = Object.defineProperty(obj, prop, handlerEnriched);

            // Remettre les propriétés.
            for (const [name, subhandler] of Object.entries(backup)) {
                // FIXME Voir pour utiliser obj à place de clazz.
                Object.defineProperty(clazz, name, subhandler);
            }
        } else {
            result = Object.defineProperty(obj, prop, handlerEnriched);
        }
        return result;
    },

    defineProperties(clazz, handlers, options) {
        for (const [prop, handler] of Object.entries(handlers)) {
            Ghost.defineProperty(clazz, prop, handler, options);
        }
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
            get(target, prop) {
                return props.readable.includes(prop)
                                                    ? Reflect.get(obj, prop)
                                                    : Reflect.get(target, prop);
            },
            set(target, prop, value) {
                return props.writable.includes(prop)
                                             ? Reflect.set(obj, prop, value)
                                             : Reflect.set(target, prop, value);
            },
            ...handler,
        };

        return Ghost.proxify(Object.create(proto, propertiesEnriched),
                             handlerEnriched,
                             options);
    },

    stripProxyInStack(err) {
        if ("Google Inc." === navigator.vendor) {
            err.stack = err.stack
                .split("\n")
                .filter((l) => !l.includes("Object.value") &&
                               !l.includes("Object.apply") &&
                               !l.includes("Object.get") &&
                               !l.includes("Reflect.get") &&
                               !l.includes("Object.setPrototypeOf") &&
                               !l.includes("apply@debugger eval code") &&
                               // FIXME Ces lignes sont liées aux plugins. Voir
                               //       pour ne gérer toutes les fonctions
                               //       proxifiées.
                               !l.includes("Object.item") &&
                               !l.includes("Object.namedItem"))
               // .map((l) => l.replace("Object.toString", "Function.toString"))
                .join("\n");
            return err;
        }
        // Sinon : gérer la stackTrace de Firefox.
        err.stack = err.stack.slice(err.stack.indexOf("\n") + 1);
        return err;
    },

    proxify(obj, handler = {}, options = {}) {
        const handlerEnriched = {
            ...handler,
            setPrototypeOf(target, proto) {
                try {
                    if (this.proxy === proto ||
                            Utils.Object.getAllPrototypes(proto)
                                        .includes(this.proxy)) {
                        throw new TypeError(CHAIN_CYCLE_ERROR_MESSAGE);
                    }
                    return "setPrototypeOf" in handler
                           ? handler.setPrototypeOf(target, proto)
                           : Reflect.setPrototypeOf(target, proto);
                } catch (err) {
                    throw Ghost.stripProxyInStack(err);
                }
            },

            apply(target, thisArg, args) {
                try {
                    // Appliquer le proxy seulement sur les objets souhaités
                    // pour éviter les appels sur le prototype. (par exemple :
                    // Navigator.prototype.plugins).
                    if ("apply" in handler &&
                            (undefined === this.instance ||
                                            thisArg instanceof this.instance)) {
                        return handler.apply(target, thisArg, args);
                    }
                    return Reflect.apply(target, thisArg, args);
                } catch (err) {
                    throw Ghost.stripProxyInStack(err);
                }
            },

            get(target, prop, receiver) {
                // FIXME Pourquoi l'appel à la fonction d'origine ne remonte pas
                //       cette erreur ? (seulement sur Firefox).
                // Ne pas tester "callee" (qui est dans le message d'erreur) car
                // les navigateurs retournent "undefined".
                /*
                if (target instanceof Function &&
                        ["caller", "arguments"].includes(prop)) {
                    throw new TypeError(
                        "'caller', 'callee', and 'arguments' properties may" +
                        " not be accessed on strict mode functions or the" +
                        " arguments objects for calls to them",
                    );
                }*/

                try {
                    return "get" in handler
                        ? handler.get(target, prop, receiver)
                        : Reflect.get(target, prop, receiver);
                } catch (err) {
                    throw Ghost.stripProxyInStack(err);
                }
            },
        };

        const proxy = new Proxy(obj, handlerEnriched);
        handlerEnriched.proxy = proxy;
        handlerEnriched.instance = options.instance;

        toStringMappings.set(proxy, obj.toString());
        setPrototypeOfMappings.set(proxy, obj);
        return proxy;
    },

    createLambdaWithName(name, fn) {
        Object.defineProperty(fn, "name", {
            value:        name,
            writable:     false,
            enumerable:   false,
            configurable: true,
        });
        return Ghost.patchToString(fn, `function ${name}() { [native code] }`);
    },

    patchToString(fn, toString) {
        toStringMappings.set(fn, toString ?? "function () { [native code] }");
        return fn;
    },
};

Ghost.defineProperty(Function, "toString", {
    value(target, thisArg, args) {
        try {
            return toStringMappings.has(thisArg)
                ? toStringMappings.get(thisArg)
                : Reflect.apply(target, thisArg, args);
        } catch (err) {
            throw Ghost.stripProxyInStack(err);
        }
    },
});

Ghost.defineProperty(ReflectNative, "setPrototypeOf", {
    value(target, thisArg, args) {
        try {
            const obj = args[0];
            const proto = args[1];
            // FIXME Voir pourquoi cette méthode est utile.
            if (setPrototypeOfMappings.has(obj)) {
                // const subobj = setPrototypeOfMappings.get(obj);
                if (obj === proto ||
                        Utils.Object.getAllPrototypes(proto)
                                    .includes(obj)) {
                    return false;
                }
                return Reflect.apply(target, thisArg, [obj, proto]);
            }
            return Reflect.apply(target, thisArg, args);
        } catch (err) {
            throw Ghost.stripProxyInStack(err);
        }
    },
}, { prototype: false });
