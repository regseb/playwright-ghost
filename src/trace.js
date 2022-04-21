/**
 * @module
 */

export default function trace(object, hook) {
    return new Proxy(object, {
        get: (target, property, receiver) => {
            if (target[property] instanceof Function) {
                const wrap = (...args) => {
                    args = hook.before(receiver, property, args);
                    let returnValue = target[property](...args);
                    return hook.after(receiver, property, args, returnValue);
                };
                Object.defineProperty(wrap, "name", {
                    value:        target[property].name,
                    configurable: true,
                });
                return wrap;
            }

            return target[property];
        },
    });
};
