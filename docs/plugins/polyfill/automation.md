# `polyfill.automation`

> [!NOTE]
>
> This plugin only applies to Chromium.

> [!TIP]
>
> This plugin is enabled in the ⭐️ [`recommended`](../recommended.md).

Disable `--enable-automation` in Chromium.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.automation()],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/polyfill/automation"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import automationPlugin from "playwright-ghost/plugins/polyfill/automation";

const browser = await chromium.launch({
  plugins: [automationPlugin()],
});
// ...
```
