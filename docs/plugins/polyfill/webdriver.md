# `polyfill/webdriver`

> [!NOTE]
>
> This plugin only applies to Chromium.

> [!TIP]
>
> This plugin is enabled in the ⭐ recommended.

Set `navigator.webdriver` to `false`.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.webdriver()],
});
// ...
```