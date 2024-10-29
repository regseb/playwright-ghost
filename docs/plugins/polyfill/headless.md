# `polyfill/headless`

> [!NOTE]
>
> This plugin only applies to Chromium.

> [!TIP]
>
> This plugin is enabled in the ⭐ recommended.

Correct many differences in Javascript APIs between the headful and headless
versions of Chromium. This plugin activates Chromium's new headless mode.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.headless()],
});
// ...
```
