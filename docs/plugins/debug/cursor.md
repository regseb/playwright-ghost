# `debug.cursor`

Show cursor in page.

This plugin isn't recommended for use in production.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.debug.cursor],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/debug/cursor"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import cursorPlugin from "playwright-ghost/plugins/debug/cursor";

const browser = await chromium.launch({
  plugins: [cursorPlugin()],
});
// ...
```
