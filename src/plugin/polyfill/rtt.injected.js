const options = importMeta.arguments;

Ghost.defineProperty(NetworkInformation, "rtt", {
    get() {
        return options.rtt;
    },
});
