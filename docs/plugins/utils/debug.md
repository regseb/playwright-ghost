# `utils.debug`

Display messages from the browser console in the program console.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.debug()],
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
