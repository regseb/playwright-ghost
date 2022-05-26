/**
 * @module
 */

export default function hook(obj, plugins) {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            if (target[prop] instanceof Function) {
                const wrap = (...args) => {
                    const argsAltered = plugins.reduce((a, p) => {
                        return p.before(a, {
                            obj: receiver,
                            prop,
                        });
                    }, args);

                    const returnValue = target[prop](...argsAltered);

                    return plugins.reduce((r, p) => {
                        return p.after(r, {
                            obj:  receiver,
                            prop,
                            args: argsAltered,
                        });
                    }, returnValue);
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
