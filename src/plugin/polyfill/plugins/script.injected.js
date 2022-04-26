const Collection = class extends Array {
    static create(arr, keyProp) {
        return Ghost.proxify(new Collection(arr, keyProp), {
            has(target, prop) {
                const props = Object.keys({
                    ...Object.getOwnPropertyDescriptors(target),
                    ...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(
                                                                       target)),
                });
                return props.includes(prop);
            },
        });
    }

    constructor(arr, keyProp) {
        super(...arr);
        for (const element of arr) {
            Object.defineProperty(this, element[keyProp], {
                value: element,
            });
        }
        for (const prop of Object.getOwnPropertyNames(arr)) {
            if ("length" !== prop && !(/^\d+$/u).test(prop)) {
                Object.defineProperty(this, prop, { value: arr[prop] });
            }
        }
    }

    item(index) {
        // Retourner le premier élément quand le paramètre n'est pas un nombre.
        // Si le paramètre est un nombre : prendre le nombre entier inférieur.
        return isNaN(+index) ? this[0]
                             : this[Math.trunc(+index)] ?? null;
    }

    namedItem(key) {
        console.log(this);
        // Ignorer les nombres pour ne pas retourner un élément par son index ;
        // et aussi la propriété "length".
        return isNaN(+key) && "length" !== key ? this[key] ?? null
                                               : null;
    }
};

const MimeTypeClass = class {
    #description;
    #suffixes;
    #type;

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
};

// Convertir une collection en MimeTypeArray ou PluginArray.
const convert = (arr, proto, keyProp) => {
    const names = Object.getOwnPropertyNames(arr)
                        .filter((n) => !(/^\d+$/u).test(n));

    const collection = Collection.create(arr, keyProp);

    const properties = Object.fromEntries(
        Object.entries(Object.getOwnPropertyDescriptors(collection))
              .map(([prop, descriptor]) => {
            // Rendre configurable les propriétés récupérées du tableau car il
            // ne faut pas les retourner à l'appel de
            // Object.getOwnPropertyNames() (sans cette configuration à true,
            // l'erreur suivante est retournée : "proxy can't skip a
            // non-configurable property 'length'").
            return names.includes(prop)
                                 ? [prop, { ...descriptor, configurable: true }]
                                 : [prop, descriptor];
        }),
    );

    return Ghost.conceal(collection, proto, {
        properties,
        ownKeys() {
            return Object.getOwnPropertyNames(collection)
                         .filter((n) => !names.includes(n));
        },

        getOwnPropertyDescriptor(target, prop) {
            return names.includes(prop)
                ? undefined
                : Reflect.getOwnPropertyDescriptor(target, prop);
        },
    });
};

// Quand Firefox est contrôlé par Playwright, le prototype Plugin a une
// propriété "version" en plus.
delete Plugin.prototype.version;

const MIME_TYPES_DATA = [{
    description: "Portable Document Format",
    suffixes: "pdf",
    type: "application/pdf",
}, {
    description: "Portable Document Format",
    suffixes: "pdf",
    type: "text/pdf",
}]
const MIME_TYPES = MIME_TYPES_DATA.map((m) => Ghost.conceal(m, MimeType.prototype));

const PLUGINS_DATA = [{
    description: "Portable Document Format",
    filename: "internal-pdf-viewer",
    name: "PDF Viewer",
}, {
    description: "Portable Document Format",
    filename: "internal-pdf-viewer",
    name: "Chrome PDF Viewer",
}, {
    description: "Portable Document Format",
    filename: "internal-pdf-viewer",
    name: "Chromium PDF Viewer",
}, {
    description: "Portable Document Format",
    filename: "internal-pdf-viewer",
    name: "Microsoft Edge PDF Viewer",
}, {
    description: "Portable Document Format",
    filename: "internal-pdf-viewer",
    name: "WebKit built-in PDF",
}];
const PLUGINS = PLUGINS_DATA.map((pluginData) => {
    const plugin = MIME_TYPES.slice();
    Object.defineProperty(plugin, "description", {
        value: pluginData.description,
    });
    Object.defineProperty(plugin, "filename", {
        value: pluginData.filename,
    });
    Object.defineProperty(plugin, "name", {
        value: pluginData.name,
    });
    return convert(plugin, Plugin.prototype, "type");
});

for (const mimeTypeData of MIME_TYPES_DATA) {
    mimeTypeData.enabledPlugin = PLUGINS[0];
}

const mimeTypes = convert(MIME_TYPES, MimeTypeArray.prototype, "type");
const plugins = convert(PLUGINS, PluginArray.prototype, "name");

Ghost.defineProperty(Object.getPrototypeOf(navigator), "mimeTypes", {
    get() { return mimeTypes; },
}, { nativeThis: navigator });
Ghost.defineProperty(Object.getPrototypeOf(navigator), "plugins", {
    get() { return plugins; },
}, { nativeThis: navigator });
