# `polyfill.viewport`

> [!TIP]
>
> This plugin is enabled in the ⭐️ [`recommended`](../recommended.md).

Vary viewport size with random values between 1000x500 and 1800x800.

## Options

This plugin supports the following options:

- `width`:
  - `min`: (default `1000`): Minimum viewport width.
  - `max`: (default `1800`): Maximum viewport width.
- `height`:
  - `min`: (default `500`): Minimum viewport height.
  - `max`: (default `800`): Maximum viewport height.

## Examples

Use the plugin with default options.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.viewport()],
});
// ...
```

Use the plugin and specify a viewport between 1400x600 and 1800x800.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [
    plugins.polyfill.viewport({
      width: { min: 1400, max: 1800 },
      height: { min: 600, max: 800 },
    }),
  ],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/polyfill/viewport"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import viewportPlugin from "playwright-ghost/plugins/polyfill/viewport";

const browser = await chromium.launch({
  plugins: [viewportPlugin()],
});
// ...
```
