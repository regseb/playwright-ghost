# `debug.console`

Display
[console messages](https://playwright.dev/docs/api/class-page#page-event-console)
and [error](https://playwright.dev/docs/api/class-page#page-event-page-error)
from the browser in the program console.

This plugin isn't recommended for use in production.

## Options

This plugin supports the following option:

- `console` (default `true`): Flag to transfer console messages.
- `pageError` (default `true`): Flag to transfer error.

## Example

Use the plugin with default options (all transfer).

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.debug.console()],
});
// ...
```

Use the plugin and transfer only error.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.debug.console({ console: false })],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/debug/console"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import consolePlugin from "playwright-ghost/plugins/debug/console";

const browser = await chromium.launch({
  plugins: [consolePlugin()],
});
// ...
```
