const CollectionUtils = {

    constructor(thisArg, arr, keyProp) {
        for (const [index, element] of arr.entries()) {
            Object.defineProperty(thisArg, index, {
                value:    element,
                writable: false,
            });
            Object.defineProperty(thisArg, element[keyProp], {
                value:        element,
                configurable: true,
            });
        }
    },

    item(thisArg, index) {
        // Retourner le premier élément quand le paramètre n'est pas un nombre.
        // Si le paramètre est un nombre : prendre le nombre entier inférieur
        // modulo 2^32.
        /* eslint-disable no-implicit-coercion */
        return Number.isNaN(+index) || !Number.isFinite(+index)
                                ? thisArg[0]
                                // eslint-disable-next-line unicorn/no-null
                                : thisArg[Math.trunc(+index) % 2 ** 32] ?? null;
        /* eslint-enable no-implicit-coercion */
    },

    namedItem(thisArg, key) {
        // Ignorer les nombres pour ne pas retourner un élément par son index.
        // eslint-disable-next-line no-implicit-coercion
        if (!Number.isNaN(+key)) {
            // eslint-disable-next-line unicorn/no-null
            return null;
        }

        for (const item of thisArg) {
            if (item === thisArg[key]) {
                return item;
            }
        }

        // eslint-disable-next-line unicorn/no-null
        return null;
    },
};

const MimeTypeClass = class {

    #description;

    #suffixes;

    #type;

    #enabledPlugin;

    constructor(data) {
        this.#description = data.description;
        this.#suffixes = data.suffixes;
        this.#type = data.type;
    }

    get description() {
        return this.#description;
    }

    get suffixes() {
        return this.#suffixes;
    }

    get type() {
        return this.#type;
    }

    get enabledPlugin() {
        return this.#enabledPlugin;
    }

    set enabledPlugin(enabledPlugin) {
        this.#enabledPlugin = enabledPlugin;
    }

    clone() {
        return new MimeTypeClass({
            description: this.#description,
            suffixes:    this.#suffixes,
            type:        this.#type,
        });
    }
};

const PluginClass = class extends Array {

    #description;

    #filename;

    #name;

    constructor(data, mimeTypes) {
        super(...mimeTypes);
        CollectionUtils.constructor(this, mimeTypes, "type");
        this.#description = data.description;
        this.#filename = data.filename;
        this.#name = data.name;
    }

    get description() {
        return this.#description;
    }

    get filename() {
        return this.#filename;
    }

    get name() {
        return this.#name;
    }
};
// Déclarer les méthodes item() et namedItem() en dehors de la classe car il
// faut les proxiées pour cacher les méthodes toString().
Object.defineProperty(PluginClass.prototype, "item", {
    value: Ghost.proxify(Plugin.prototype.item, {
        apply(_target, thisArg, args) {
            return CollectionUtils.item(thisArg, ...args);
        },
    }),
});
Object.defineProperty(PluginClass.prototype, "namedItem", {
    value: Ghost.proxify(Plugin.prototype.namedItem, {
        apply(_target, thisArg, args) {
            return CollectionUtils.namedItem(thisArg, ...args);
        },
    }),
});

const PluginArrayClass = class extends Array {
    constructor(arr) {
        super(...arr);
        CollectionUtils.constructor(this, arr, "name");
    }
};
// Déclarer les méthodes item() et namedItem() en dehors de la classe car il
// faut les proxifées pour cacher les méthodes toString().
Object.defineProperty(PluginArrayClass.prototype, "item", {
    value: Ghost.proxify(PluginArray.prototype.item, {
        apply(_target, thisArg, args) {
            return CollectionUtils.item(thisArg, ...args);
        },
    }),
});
Object.defineProperty(PluginArrayClass.prototype, "namedItem", {
    value: Ghost.proxify(PluginArray.prototype.namedItem, {
        apply(_target, thisArg, args) {
            return CollectionUtils.namedItem(thisArg, ...args);
        },
    }),
});

const MimeTypeArrayClass = class extends Array {
    constructor(arr) {
        super(...arr);
        CollectionUtils.constructor(this, arr, "type");
    }
};
// Déclarer les méthodes item() et namedItem() en dehors de la classe car il
// faut les proxifées pour cacher les méthodes toString().
Object.defineProperty(MimeTypeArrayClass.prototype, "item", {
    value: Ghost.proxify(MimeTypeArray.prototype.item, {
        apply(_target, thisArg, args) {
            return CollectionUtils.item(thisArg, ...args);
        },
    }),
});
Object.defineProperty(MimeTypeArrayClass.prototype, "namedItem", {
    value: Ghost.proxify(MimeTypeArray.prototype.namedItem, {
        apply(_target, thisArg, args) {
            return CollectionUtils.namedItem(thisArg, ...args);
        },
    }),
});

// Convertir une collection en MimeTypeArray ou PluginArray.
const convert = (collection, proto) => {
    return Ghost.conceal(collection, proto, {
        properties: {
            // Rendre configurable la propriété "length" récupérée du tableau
            // car il ne faut pas la retourner à l'appel de
            // Object.getOwnPropertyNames() (sans cette configuration à true,
            // l'erreur suivante est retournée : "proxy can't skip a
            // non-configurable property 'length'").
            length: {
                ...Object.getOwnPropertyDescriptor(collection, "length"),
                configurable: true,
            },
        },
        ownKeys() {
            return Object.getOwnPropertyNames(collection)
                         .filter((n) => "length" !== n);
        },

        getOwnPropertyDescriptor(target, prop) {
            return "length" === prop
                          ? undefined
                          : Reflect.getOwnPropertyDescriptor(target, prop);
        },
    });
};

const MIME_TYPES_DATA = [{
    description: "Portable Document Format",
    suffixes:    "pdf",
    type:        "application/pdf",
}, {
    description: "Portable Document Format",
    suffixes:    "pdf",
    type:        "text/pdf",
}].map((m) => new MimeTypeClass(m));

const MIME_TYPES = new MimeTypeArrayClass(MIME_TYPES_DATA.map((mimeType) => {
    return Ghost.conceal(mimeType, MimeType.prototype);
}));

const PLUGINS_DATA = [{
    description: "Portable Document Format",
    filename:    "internal-pdf-viewer",
    name:        "PDF Viewer",
}, {
    description: "Portable Document Format",
    filename:    "internal-pdf-viewer",
    name:        "Chrome PDF Viewer",
}, {
    description: "Portable Document Format",
    filename:    "internal-pdf-viewer",
    name:        "Chromium PDF Viewer",
}, {
    description: "Portable Document Format",
    filename:    "internal-pdf-viewer",
    name:        "Microsoft Edge PDF Viewer",
}, {
    description: "Portable Document Format",
    filename:    "internal-pdf-viewer",
    name:        "WebKit built-in PDF",
}].map((p) => {
    // Cloner les mimeTypes car ce ne doit pas être les mêmes instances dans
    // chaque plugin.
    if (navigator.userAgent.includes("Chrome")) {
        const mimeTypes = new MimeTypeArrayClass(
            MIME_TYPES_DATA.map((mimeType) => {
                return Ghost.conceal(mimeType, MimeType.prototype);
            }),
        );
        return new PluginClass(p, mimeTypes);
    }
    return new PluginClass(p, MIME_TYPES);
});

const PLUGINS = new PluginArrayClass(PLUGINS_DATA.map((plugin) => {
    return convert(plugin, Plugin.prototype);
}));

for (const mimeTypeData of MIME_TYPES_DATA) {
    mimeTypeData.enabledPlugin = PLUGINS[0];
}

const mimeTypes = convert(MIME_TYPES, MimeTypeArray.prototype, "type");
const plugins = convert(PLUGINS, PluginArray.prototype, "name");

Ghost.defineProperties(Navigator, {
    mimeTypes: {
        get() {
            return mimeTypes;
        },
    },
    plugins: {
        get() {
            return plugins;
        },
    },
});
