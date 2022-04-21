// console.log("export default " + JSON.stringify(
({
    navigator: {
        webdriver: navigator.webdriver,
        typeof: typeof navigator.webdriver,
        in: 'webdriver' in navigator,
        keys: Object.keys(navigator),
        // eslint-disable-next-line no-undef
        prototypeKeys: Object.keys(Navigator.prototype),
        getOwnPropertyNames: Object.getOwnPropertyNames(navigator),
        prototypeGetOwnPropertyNames: Object.getOwnPropertyNames(
            // eslint-disable-next-line no-undef
            Navigator.prototype
        ),
        ownPropertyDescriptor: undefined === Object.getOwnPropertyDescriptor(
            navigator,
            "webdriver",
        ),
        prototypeOwnPropertyDescriptor: Object.getOwnPropertyDescriptor(
            // eslint-disable-next-line no-undef
            Navigator.prototype,
            'webdriver'
        ),
        ownPropertyDescriptors: Object.getOwnPropertyDescriptors(
            navigator,
            "webdriver",
        ),
        prototypeOwnPropertyDescriptors: Object.getOwnPropertyDescriptors(
            // eslint-disable-next-line no-undef
            Navigator.prototype,
            'webdriver'
        ),
        /*
        getToString: Object.getOwnPropertyDescriptor(
            // eslint-disable-next-line no-undef
            Navigator.prototype,
            'webdriver'
        ).get.toString(),
        */
    },
})
//, (_, v) => undefined === v ? "[undefined]" : v, 4)
//    .replace(`"[undefined]"`, "undefined"));
