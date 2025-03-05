# `humanize/dialog`

> [!TIP]
>
> This plugin is enabled in the ⭐ [`recommended`](../recommended.md).

Close [`<dialog>`](https://developer.mozilla.org/Web/HTML/Element/dialog) within
a humanly possible time (between 1 and 5 seconds). By default Playwright
[closes them immediately](https://playwright.dev/docs/dialogs).

## Options

This plugin supports the following option:

- `delay`:
  - `min` (default `1000`): Minimum waiting time in milliseconds.
  - `max` (default `5000`): Maximum waiting time in milliseconds.

## Examples

Use the plugin with default options.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.humanize.dialog()],
});
// ...
```

Use the plugin and specify a delay between 500 milliseconds and 2 seconds.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.humanize.dialog({ delay: { min: 500, max: 2000 } })],
});
// ...
```
