# `polyfill.automation`

> [!NOTE]
>
> This plugin only applies to Chromium.

> [!TIP]
>
> This plugin is enabled in the ⭐ [`recommended`](../recommended.md).

Disable `--enable-automation` in Chromium.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.automation()],
});
// ...
```
