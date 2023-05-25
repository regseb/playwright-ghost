/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// @ts-ignore https://github.com/prettier/plugin-xml/issues/671
import pluginXML from "@prettier/plugin-xml";

export default {
    // Enlever cette option lors de passage à Prettier 3.
    // https://github.com/prettier/prettier/issues/13142
    trailingComma: "all",
    plugins: [pluginXML],
};
