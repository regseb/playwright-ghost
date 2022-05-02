const ok = (fn) => {
    const actual = fn();
    return {
        status: !!actual,
        actual,
    };
};

const strictEqual = (fn, expected) => {
    const actual = fn();
    if (Number.isNaN(actual) && Number.isNaN(expected)) {
        return { status: true, actual };
    }
    return { status: expected === actual, actual };
};

const notStrictEqual = (fn, expected) => {
    const result = strictEqual(fn, expected);
    return { status: !result.status, actual: result.actual };
};

const throws = (fn, expected) => {
    try {
        const actual = fn();
        return { status: false, actual };
    } catch (err) {
        return {
            status: err instanceof Error &&
                    err.name === expected.name &&
                    err.message === expected.message,
            actual: err,
        };
    }
};

const deepStrictEqualInternal = (actual, expected) => {
    return "object" === typeof actual && "object" === typeof expected
        ? (Object.keys(actual).length === Object.keys(expected).length &&
           Object.keys(actual).every((k) =>
                               deepStrictEqualInternal(actual[k], expected[k])))
        : (actual === expected);
};

const deepStrictEqual = (fn, expected) => {
    const actual = fn();
    return {
        status: deepStrictEqualInternal(actual, expected),
        actual,
    };
};

const print = (obj) => {
    if (undefined === obj) {
        return "undefined";
    }
    if (null === obj) {
        return "null";
    }
    if (Array.isArray(obj)) {
        if (0 === obj.length) {
            return "[]";
        }
        return obj.map(print).join(",");
    }
    if ("string" === typeof obj) {
        if (obj.includes(`"`)) {
            return `\`${obj}\``;
        }
        return `"${obj}"`;

    }
    return obj;
};

const test = (fn, assert, expected) => {
    let result;
    try {
        result = assert(fn, expected);
    } catch (err) {
        result = { status: false, actual: err };
    }

    const code = fn.toString().replace(/^\(\)\s*=>\s*(\{\s*return\s*)?/u, "")
                              .replace(/;\s*\}\s*$/u, "");
    if (result.status) {
        const tr = document.querySelector("template.passed").content
                                                            .cloneNode(true);
        tr.querySelector(".code code").textContent = code;
        tr.querySelector(".actual code").textContent = print(result.actual);
        document.querySelector("tbody").append(tr);
    } else {
        const tr = document.querySelector("template.failed").content
                                                            .cloneNode(true);
        tr.querySelector(".code code").textContent = code;
        tr.querySelector(".actual code").textContent = print(result.actual);
        tr.querySelector(".expected code").textContent = print(expected);
        document.querySelector("tbody").append(tr);
    }
};

test.ok = (...args) => {
    args.splice(1, 0, ok);
    args.splice(2, 0, true);
    return test(...args);
};

test.strictEqual = (...args) => {
    args.splice(1, 0, strictEqual);
    return test(...args);
};

test.notStrictEqual = (...args) => {
    args.splice(1, 0, notStrictEqual);
    return test(...args);
};

test.deepStrictEqual = (...args) => {
    args.splice(1, 0, deepStrictEqual);
    return test(...args);
};

test.throws = (...args) => {
    args.splice(1, 0, throws);
    return test(...args);
};


// Plugins.
test.strictEqual(() => navigator.plugins.length, 5);
test.strictEqual(() => navigator.plugins[5], undefined);
test.ok(() => navigator.plugins[0] instanceof Plugin);
test.strictEqual(() => navigator.plugins[1].__proto__, Plugin.prototype);
test.strictEqual(() => Object.getPrototypeOf(navigator.plugins[2]),
                 Plugin.prototype);
test.strictEqual(() => navigator.plugins[3].prototype, undefined);
test.strictEqual(() => navigator.plugins[4].toString(), "[object Plugin]");
test.strictEqual(() => "" + navigator.plugins[0], "[object Plugin]");
test.strictEqual(() => navigator.plugins[1] + "", "[object Plugin]");
test.strictEqual(() => JSON.stringify(navigator.plugins[2]), `{"0":{},"1":{}}`);
test.strictEqual(() => +navigator.plugins[3], NaN);
test.strictEqual(() => [...navigator.plugins[4]].length, 2);
test.strictEqual(() => Object.getPrototypeOf([...navigator.plugins[0]][0]),
                       MimeType.prototype);
test.strictEqual(() => [...navigator.plugins[1]][1].type, "text/pdf");
test.strictEqual(() => ({ ...navigator.plugins[2] })[0].type,
                       "application/pdf");
test.strictEqual(() => ({ ...navigator.plugins[3] })[1].type, "text/pdf");
test.ok(() => navigator.plugins[2][0] === navigator.plugins[3][0]);
test.ok(() => navigator.plugins[4][0] !== navigator.plugins[4][1]);
test.ok(() => navigator.plugins[0][0] === navigator.mimeTypes[0]);
test.ok(() => navigator.plugins[1][1] === navigator.mimeTypes[1]);
test.throws(() => structuredClone(navigator.plugins[0]), {
    "name": "DataCloneError",
    "message": "The object could not be cloned.",
});
test.deepStrictEqual(() => Object.getOwnPropertyNames(navigator.plugins), [
    "0", "1", "2", "3", "4", "PDF Viewer", "Chrome PDF Viewer",
    "Chromium PDF Viewer", "Microsoft Edge PDF Viewer", "WebKit built-in PDF",
]);
test.deepStrictEqual(() => Object.getOwnPropertySymbols(navigator.plugins), []);
test.deepStrictEqual(() => {
    return Object.keys(Object.getOwnPropertyDescriptors(navigator.plugins));
}, [
    "0", "1", "2", "3", "4", "PDF Viewer", "Chrome PDF Viewer",
    "Chromium PDF Viewer", "Microsoft Edge PDF Viewer", "WebKit built-in PDF",
]);
test.ok(() => {
    return Object.getOwnPropertyDescriptors(navigator.plugins)["0"] !==
                        Object.getOwnPropertyDescriptor(navigator.plugins, "0");
});
test.deepStrictEqual(() => ({
    ...Object.getOwnPropertyDescriptors(navigator.plugins)[1],
    value: Object.getOwnPropertyDescriptors(navigator.plugins)[0].value
                                                              .constructor.name,
}), { value: "Plugin", writable: false, enumerable: true, configurable: true });
test.deepStrictEqual(() => ({
    ...Object.getOwnPropertyDescriptors(navigator.plugins)["PDF Viewer"],
    value: Object.getOwnPropertyDescriptors(navigator.plugins)["PDF Viewer"]
                                                        .value.constructor.name,
}), {
    value: "Plugin", writable: false, enumerable: false, configurable: true,
});
test.ok(() => navigator.plugins[1] ===
                 Object.getOwnPropertyDescriptor(navigator.plugins, "1").value);


// Plugins / MimeType - item() / namedItem().
test.ok(() => navigator.plugins[0].item === navigator.plugins[0].item);
test.ok(() => navigator.plugins[1].namedItem ===
                                                navigator.plugins[2].namedItem);
test.ok(() => navigator.mimeTypes[0].item === navigator.mimeTypes[0].item);
test.ok(() => navigator.mimeTypes[0].namedItem ===
                                              navigator.mimeTypes[1].namedItem);
test.ok(() => navigator.plugins[0].item !== navigator.mimeTypes[0].item);
test.ok(() => navigator.plugins[0][0].namedItem ===
                                              navigator.mimeTypes[0].namedItem);
test.strictEqual(() => navigator.plugins.item(0), navigator.plugins[0]);
test.strictEqual(() => navigator.plugins.item(1), navigator.plugins[1]);
test.strictEqual(() => navigator.plugins.item(5), null);
test.strictEqual(() => navigator.plugins.item("foo"), navigator.plugins[0]);
test.strictEqual(() => navigator.plugins.item("Chrome PDF Viewer"),
                 navigator.plugins[0]);
test.strictEqual(() => navigator.plugins.item(null), navigator.plugins[0]);
test.strictEqual(() => navigator.plugins.item(undefined), navigator.plugins[0]);
test.strictEqual(() => navigator.plugins.item(-1), null);
test.strictEqual(() => navigator.plugins.item(0.9), navigator.plugins[0]);
test.strictEqual(() => navigator.plugins.item(4.9), navigator.plugins[4]);
test.strictEqual(() => navigator.plugins.item(5.9), null);
test.strictEqual(() => navigator.plugins.item(-0.9), navigator.plugins[0]);
test.strictEqual(() => navigator.plugins.item(-1.9), null);
test.strictEqual(() => navigator.plugins.item(Infinity), navigator.plugins[0]);
test.strictEqual(() => navigator.plugins[0].item.toString(),
                 "function item() {\n    [native code]\n}");
test.strictEqual(() => navigator.plugins[1].namedItem.toString(),
                 "function namedItem() {\n    [native code]\n}");


console.log("avant", document.querySelector("tbody").classList);
document.querySelector("tbody").classList.remove("running");
console.log("apres", document.querySelector("tbody").classList);
