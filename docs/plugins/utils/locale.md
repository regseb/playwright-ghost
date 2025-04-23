# `utils.locale`

Use the locally installed browser.

## Options

This plugin supports the following option:

- `name` (default
  [`BrowserType.name()`](https://playwright.dev/docs/api/class-browsertype#browser-type-name)):
  Navigator name.

## Example

Use the plugin with default options.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.utils.locale()],
});
// ...
```

Use the plugin and replace `chromium` by `chrome` (locally installed).

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.utils.locale({ name: "chrome" })],
});
// ...
```
