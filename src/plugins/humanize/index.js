/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/* @ts-self-types="../../../types/plugins/humanize/index.d.ts" */

import humanizeClickPlugin from "./click.js";
import humanizeCursorPlugin from "./cursor.js";
import humanizeDialogPlugin from "./dialog.js";
import humanizeRecommendedPlugins from "./recommended.js";

/**
 * @typedef {import("./click.js").HumanizeClickOptions} HumanizeClickOptions
 * @typedef {import("./cursor.js").HumanizeCursorOptions} HumanizeCursorOptions
 * @typedef {import("./dialog.js").HumanizeDialogOptions} HumanizeDialogOptions
 * @typedef {import("./recommended.js").HumanizeRecommendedOptions} HumanizeRecommendedOptions
 */

/**
 * Les plugins pour humaniser les actions.
 */
const humanizePlugins = {
    click: humanizeClickPlugin,
    cursor: humanizeCursorPlugin,
    dialog: humanizeDialogPlugin,

    recommended: humanizeRecommendedPlugins,
};
export default humanizePlugins;
