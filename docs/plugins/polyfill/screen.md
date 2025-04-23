# `polyfill.screen`

> [!TIP]
>
> This plugin is enabled in the ⭐ [`recommended`](../recommended.md).

Set a realistic value for screen size: 1920x1080.

## Options

This plugin supports the following options:

- `width` (default `1920`): Screen width.
- `height` (default `1080`): Screen height.

## Examples

Use the plugin with default options.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.screen()],
});
// ...
```

Use the plugin and specify a screen size of 2560x1440.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.screen({ width: 2560, height: 1440 })],
});
// ...
```
