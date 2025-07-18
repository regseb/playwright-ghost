# `polyfill.webdriver`

> [!NOTE]
>
> This plugin only applies to Chromium.

> [!TIP]
>
> This plugin is enabled in the ⭐️ [`recommended`](../recommended.md).

Set `navigator.webdriver` to `false`.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.webdriver()],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/polyfill/webdriver"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import webdriverPlugin from "playwright-ghost/plugins/polyfill/webdriver";

const browser = await chromium.launch({
  plugins: [webdriverPlugin()],
});
// ...
```
