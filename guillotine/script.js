import { Typeson, builtin } from "https://cdn.jsdelivr.net/npm/typeson-registry@3.0.0/+esm";
import { inspectObject } from "./inspector/meta.js";
import BotD from "./inspector/botd.js";

const searchParams = new URL(location.href).searchParams;
const argv = {
    ref:     searchParams.get("ref"),
    passed:  "true" === (searchParams.get("passed") ?? "true"),
    failed:  "true" === (searchParams.get("failed") ?? "true"),
    ignored: "true" === (searchParams.get("ignored") ?? "true"),
};

const typeson = new Typeson().register(builtin).register({
    DOMException: [
        (x) => x instanceof DOMException, // tester
        (err) => ({ // encapsulator
            code: err.code,
            columnNumber: err.columnNumber,
            data: err.data,
            lineNumber: err.lineNumber,
            message: err.message,
            name: err.name,
            result: err.result
        }),
        (data) => {
            // reviver
            const err = new DOMException(data.message);
            Object.defineProperty(err, "code", { value: data.code });
            Object.defineProperty(err, "columnNumber", {
                value: data.columnNumber,
            });
            Object.defineProperty(err, "data", { value: data.data });
            Object.defineProperty(err, "lineNumber", {
                value: data.lineNumber,
            });
            Object.defineProperty(err, "name", { value: data.name });
            Object.defineProperty(err, "result", { value: data.result });
            return err;
        },
    ],
});

const strictEqual = (actual, expected) => {
    if (Number.isNaN(actual) && Number.isNaN(expected)) {
        return true;
    }
    return expected === actual;
};

const deepStrictEqual = (actual, expected) => {
    if (actual === expected) {
        return true;
    }

    return "object" === typeof actual && "object" === typeof expected
        ? (Object.keys(actual).length === Object.keys(expected).length &&
           Object.keys(actual).every((k) =>
                                       deepStrictEqual(actual[k], expected[k])))
        : strictEqual(actual, expected);
};

const printValue = (obj) => {
    switch (obj) {
        case undefined: return "undefined";
        case null: return "null";
        case Infinity: return "Infinity";
        case -Infinity: return "-Infinity";
    }

    if (Number.isNaN(obj)) {
        return "NaN";
    }
    if (Array.isArray(obj)) {
        if (0 === obj.length) {
            return "[]";
        }
        return `[${obj.map(printValue).join(", ")}]`;
    }
    if ("string" === typeof obj) {
        if (obj.includes(`"`)) {
            return `\`${obj}\``;
        }
        return `"${obj}"`;

    }
    if (obj instanceof Error) {
        return obj;
    }
    return typeson.stringify(obj, null, 2);
};
const print = (result) => {
    return printValue("returnValue" in result ? result.returnValue
                                              : result.exception);
};

const execute = async function (tests) {
    return Object.fromEntries((await Promise.all(
        tests.flat().map(async (test) => {
            let fn, args, code;
            if (test instanceof Function) {
                fn = test;
                args = [];
                code = test.toString().replace(/^\(\s*\)\s*=>\s*/u, "");
            } else if (test.args instanceof Function) {
                fn = test.fn;
                args = test.args();
                code = `(${test.fn.toString()})(` +
                      test.args.toString().replace(/^\(\s*\)\s*=>\s*\[\s*/u, "")
                                          .replace(/\s*\]$/u, "") + ")";
            } else {
                fn = test.fn;
                args = test.args;
                code = `(${test.fn.toString()})(${printValue(test.args)})`;
            }

            let result;
            try {
                result = { returnValue: await fn(...args) };
            } catch (err) {
                result = { exception: err };
            }

            try {
                return [
                    code,
                    typeson.parse(typeson.stringify(result)),
                ];
            } catch (err) {
                // Ignorer les résultats qui ne peuvent être converti en JSON.
                // https://github.com/dfahlander/typeson/issues/29
                return [code, {}];
            }
        })
    )).filter(([_, r]) => "returnValue" in r || "exception" in r));
};

const collect = async function (tests) {
    document.querySelector("pre code").textContent =
                               typeson.stringify(await execute(tests), null, 4);
};

const compare = async function (tests, references) {
    const actuals = await execute(tests);
    const expecteds = typeson.revive(references);

    for (const [code, actual] of Object.entries(actuals)) {
        if (code in expecteds) {
            const expected = expecteds[code];
            const status = deepStrictEqual(actual, expected);
            if (status && argv.passed) {
                const tr = document.querySelector("template.passed")
                                   .content.cloneNode(true);
                tr.querySelector(".code code").textContent = code;
                tr.querySelector(".actual code").textContent = print(actual);
                document.querySelector("tbody").append(tr);
            } else if (!status && argv.failed) {
                const tr = document.querySelector("template.failed")
                                   .content.cloneNode(true);
                tr.querySelector(".code code").textContent = code;
                tr.querySelector(".actual code").textContent = print(actual);
                tr.querySelector(".expected code").textContent = print(expected);
                document.querySelector("tbody").append(tr);
            }
        } else if (argv.ignored) {
            const tr = document.querySelector("template.ignored")
                               .content.cloneNode(true);
            tr.querySelector(".code code").textContent = code;
            tr.querySelector(".actual code").textContent = print(actual);
            document.querySelector("tbody").append(tr);
        }
    }
    document.querySelector("tbody").classList.remove("running");
};

const TESTS = [
    () => Object.getOwnPropertyDescriptor(Plugin.prototype, "version"),
    () => navigator.plugins.length,
    () => navigator.mimeTypes.length,
    () => navigator.pdfViewerEnabled,
    () => new SharedArrayBuffer(),

    inspectObject(() => [Function.prototype]),
    inspectObject(() => [Function.prototype.toString]),

    inspectObject(() => [navigator]),
    inspectObject(() => [Object.getPrototypeOf(navigator)]),
    inspectObject(() => [Navigator]),
    inspectObject(() => [Navigator.prototype]),
    inspectObject(() => [navigator.plugins]),
    inspectObject(() => [Object.getPrototypeOf(navigator.plugins)]),
    inspectObject(() => [navigator.plugins[0]]),
    () => navigator.plugins[5],
    () => Navigator.prototype.plugins,
    () => navigator.plugins[0] instanceof Plugin,
    () => navigator.plugins[1].__proto__ === Plugin.prototype,
    () => Object.getPrototypeOf(navigator.plugins[2]) ===  Plugin.prototype,
    () => navigator.plugins[3].prototype,
    () => navigator.plugins[4].toString(),
    () => "" + navigator.plugins[0],
    () => navigator.plugins[1] + "",
    () => JSON.stringify(navigator.plugins[2]),
    () => +navigator.plugins[3],
    () => [...navigator.plugins[4]].length,
    () => Object.getPrototypeOf([...navigator.plugins[0]][0]) ===
                                                             MimeType.prototype,
    () => [...navigator.plugins[1]][1].type,
    () => ({ ...navigator.plugins[2] })[0].type,
    () => ({ ...navigator.plugins[3] })[1].type,
    () => navigator.plugins[2][0] === navigator.plugins[3][0],
    () => navigator.plugins[4][0] !== navigator.plugins[4][1],
    () => navigator.plugins[0][0] === navigator.mimeTypes[0],
    () => navigator.plugins[1][1] === navigator.mimeTypes[1],
    () => navigator.plugins[0][0].enabledPlugin ===
                                          navigator.plugins[0][0].enabledPlugin,
    () => navigator.plugins[0][0].enabledPlugin ===
                                          navigator.plugins[0][1].enabledPlugin,
    () => navigator.plugins[0][0].enabledPlugin ===
                                          navigator.plugins[1][0].enabledPlugin,
    () => navigator.plugins[0][0].enabledPlugin ===
                                          navigator.plugins[1][1].enabledPlugin,
    () => navigator.plugins[0][0].enabledPlugin ===
                                           navigator.mimeTypes[0].enabledPlugin,
    () => navigator.plugins[0][0].enabledPlugin ===
                                           navigator.mimeTypes[1].enabledPlugin,
    () => structuredClone(navigator.plugins[0]),
    () => Object.getOwnPropertyNames(navigator.plugins),
    () => Object.getOwnPropertySymbols(navigator.plugins),
    () => Object.keys(Object.getOwnPropertyDescriptors(navigator.plugins)),
    () => Object.getOwnPropertyDescriptors(navigator.plugins)["0"] !==
                        Object.getOwnPropertyDescriptor(navigator.plugins, "0"),
    () => ({
        ...Object.getOwnPropertyDescriptors(navigator.plugins)[1],
        value: Object.getOwnPropertyDescriptors(navigator.plugins)[0].value
                                                              .constructor.name,
    }),
    () => ({
        ...Object.getOwnPropertyDescriptors(navigator.plugins)["PDF Viewer"],
        value: Object.getOwnPropertyDescriptors(navigator.plugins)["PDF Viewer"]
                                                        .value.constructor.name,
    }),
    () => navigator.plugins[1] ===
                  Object.getOwnPropertyDescriptor(navigator.plugins, "1").value,


    // Plugins / MimeType - item() / namedItem().
    () => navigator.plugins[0].item === navigator.plugins[0].item,
    () => navigator.plugins[1].namedItem === navigator.plugins[2].namedItem,
    () => navigator.mimeTypes[0].item === navigator.mimeTypes[0].item,
    () => navigator.mimeTypes[0].namedItem === navigator.mimeTypes[1].namedItem,
    () => navigator.plugins[0].item !== navigator.mimeTypes[0].item,
    () => navigator.plugins[0][0].namedItem ===
                                               navigator.mimeTypes[0].namedItem,
    () => navigator.plugins.item(0) === navigator.plugins[0],
    () => navigator.plugins.item(1) === navigator.plugins[1],
    () => navigator.plugins.item(5),
    () => navigator.plugins.item("foo") === navigator.plugins[0],
    () => navigator.plugins.item("Chrome PDF Viewer") === navigator.plugins[0],
    () => navigator.plugins.item(null) === navigator.plugins[0],
    () => navigator.plugins.item(undefined) === navigator.plugins[0],
    () => navigator.plugins.item(-1),
    () => navigator.plugins.item(0.9) === navigator.plugins[0],
    () => navigator.plugins.item(4.9) === navigator.plugins[4],
    () => navigator.plugins.item(5.9),
    () => navigator.plugins.item(-0.9) === navigator.plugins[0],
    () => navigator.plugins.item(-1.9),
    () => navigator.plugins.item(Infinity) === navigator.plugins[0],
    () => navigator.plugins.item(Number.EPSILON) === navigator.plugins[0],
    () => navigator.plugins.item(Number.NaN) === navigator.plugins[0],
    () => navigator.plugins.item(Number.NEGATIVE_INFINITY) ===
                                                           navigator.plugins[0],
    () => Plugin.prototype.item(0),
    () => navigator.plugins.item.caller,
    () => navigator.plugins.item.callee,
    () => navigator.plugins.item.arguments,
    () => navigator.plugins.namedItem("PDF Viewer") === navigator.plugins[0],
    () => navigator.plugins.namedItem("WebKit built-in PDF") ===
                                                           navigator.plugins[4],
    ["foo", "", "0", 0, NaN, Infinity].map((i) => {
        return { fn: (index) => navigator.plugins.namedItem(index), args: [i] };
    }),
    () => navigator.plugins.item.length,
    () => navigator.plugins.item.toString(),
    () => navigator.plugins.namedItem.length,
    () => navigator.plugins.namedItem.toString(),

    ...BotD,
];


if (null === argv.ref) {
    await collect(TESTS);
} else {
    const response = await fetch(`./data/${argv.ref}.json`);
    const references = await response.json();
    console.log("compar");
    await compare(TESTS, references);
    console.log("compar fin");
}
