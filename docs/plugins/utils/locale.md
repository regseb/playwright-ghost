# `utils.locale`

Use the locally installed browser.

## Options

This plugin supports the following option:

- `name` (default
  [`BrowserType.name()`](https://playwright.dev/docs/api/class-browsertype#browser-type-name)):
  Executable name.

## Example

Use the plugin with default options.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.locale()],
});
// ...
```

Use the plugin and replace Chromium by Chrome (locally installed).

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.locale({ name: "google-chrome" })],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/utils/locale"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import localePlugin from "playwright-ghost/plugins/utils/locale";

const browser = await chromium.launch({
  plugins: [localePlugin()],
});
// ...
```
