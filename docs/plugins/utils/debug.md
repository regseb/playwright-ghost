# `utils.debug`

Add debugging to a page:

- Display messages from the browser console in the program console.
- Display error from the browser in the program console.
- Show cursor in page.

This plugin isn't recommended for use in production.

## Options

This plugin supports the following option:

- `console` (default `true`): Flag to activate console messages.
- `pageerror` (default `true`): Flag to activate error from the browser.
- `cursor` (default `true`): Flag to show cursor.

## Example

Use the plugin with default options (all activated).

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.debug()],
});
// ...
```

Use the plugin and active only cursor.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.debug({ console: false, pageerror: false })],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/utils/debug"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import debugPlugin from "playwright-ghost/plugins/utils/debug";

const browser = await chromium.launch({
  plugins: [debugPlugin()],
});
// ...
```
