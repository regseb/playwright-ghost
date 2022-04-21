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
    }

    item(index) {
        // Retourner le premier élément quand le paramètre n'est pas un nombre.
        // Si le paramètre est un nombre : prendre le nombre entier inférieur.
        return isNaN(+index) ? this[0]
                             : this[Math.trunc(+index)] ?? null;
    }

    namedItem(key) {
        // Ignorer les nombres pour ne pas retourner un élément par son index ;
        // et aussi le propriété "length".
        return isNaN(+key) && "length" !== key ? this[key] ?? null
                                               : null;
    }
};

// Convertir une collection en MimeTypeArray ou PluginArray.
const convert = (arr, proto, keyProp) => {
    const collection = Collection.create(arr, keyProp);
    return Ghost.conceal(collection, proto, {
        properties: {
            ...Object.getOwnPropertyDescriptors(arr),
            length: {
                value:        collection.length,
                writable:     false,
                enumerable:   false,
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
    suffixes: "pdf",
    type: "application/pdf",
}, {
    description: "Portable Document Format",
    suffixes: "pdf",
    type: "text/pdf",
}].map((m) => Ghost.conceal(m, MimeType.prototype));

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
}].map((p) => Ghost.conceal(p, Plugin.prototype));

for (const mimeTypeData of MIME_TYPES_DATA) {
    mimeTypeData.enabledPlugin = PLUGINS_DATA[0];
}

const mimeTypes = convert(MIME_TYPES_DATA, MimeTypeArray.prototype, "type");
const plugins = convert(PLUGINS_DATA, PluginArray.prototype, "name");

Ghost.defineProperty(Object.getPrototypeOf(navigator), "mimeTypes", {
    get: () => mimeTypes,
});
Ghost.defineProperty(Object.getPrototypeOf(navigator), "plugins", {
    get: () => plugins,
});
