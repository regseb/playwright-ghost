# `polyfill.screen`

> [!TIP]
>
> This plugin is enabled in the ⭐️ [`recommended`](../recommended.md).

Set a realistic value for screen size: 1920x1080.

## Options

This plugin supports the following options:

- `width` (default `1920`): Screen width.
- `height` (default `1080`): Screen height.

## Examples

Use the plugin with default options.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.screen()],
});
// ...
```

Use the plugin and specify a screen size of 2560x1440.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.screen({ width: 2560, height: 1440 })],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/polyfill/screen"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import screenPlugin from "playwright-ghost/plugins/polyfill/screen";

const browser = await chromium.launch({
  plugins: [screenPlugin()],
});
// ...
```
