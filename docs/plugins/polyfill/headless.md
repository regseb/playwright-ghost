# `polyfill.headless`

> [!NOTE]
>
> This plugin only applies to Chromium.

> [!TIP]
>
> This plugin is enabled in the ⭐️ [`recommended`](../recommended.md).

Correct many differences in JavaScript APIs between the headful and headless
versions of Chromium. This plugin activates Chromium's new headless mode.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.headless()],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/polyfill/headless"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import headlessPlugin from "playwright-ghost/plugins/polyfill/headless";

const browser = await chromium.launch({
  plugins: [headlessPlugin()],
});
// ...
```
