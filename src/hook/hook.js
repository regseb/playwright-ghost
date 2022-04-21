/**
 * @module
 */

export default class Hook {

    plugins;

    constructor(plugins = []) {
        this.plugins = plugins;
    }

    before(object, property, args) {
        const name = `${object.constructor.name}_${property}_before`;

        return this.plugins.filter((p) => undefined !== p[name])
                           .reduce((a, p) => p[name](a, object), args);
    }

    after(object, property, args, returnValue) {
        const name = `${object.constructor.name}_${property}_after`;

        return this.plugins.filter((p) => undefined !== p[name])
                           .reduce((r, p) => p[name](r, object, args),
                                   returnValue);
    }
}
