/**
 * @module
 */

export default function trace(obj, hook) {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            if (target[prop] instanceof Function) {
                const wrap = (...args) => {
                    const argsAltered = hook.before(receiver, prop, args);
                    const returnValue = target[prop](...argsAltered);
                    return hook.after(receiver, prop, argsAltered, returnValue);
                };
                Object.defineProperty(wrap, "name", {
                    value:        target[prop].name,
                    configurable: true,
                });
                return wrap;
            }

            return target[prop];
        },
    });
}
