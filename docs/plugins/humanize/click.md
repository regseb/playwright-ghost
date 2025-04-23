# `humanize.click`

> [!TIP]
>
> This plugin is enabled in the ⭐ [`recommended`](../recommended.md).

Add delay between `mousedown` and `mouseup` for
[`Locator.click()`](https://playwright.dev/docs/api/class-locator#locator-click),
[`Locator.dblclick()`](https://playwright.dev/docs/api/class-locator#locator-dblclick),
[`Mouse.click()`](https://playwright.dev/docs/api/class-mouse#mouse-click) and
[`Mouse.dblclick()`](https://playwright.dev/docs/api/class-mouse#mouse-dblclick).
Deprecated methods (ex: `Page.click()`) class are not modified.

If you set the `delay` property when you call the method, your value will be
used.

## Options

This plugin supports the following options:

- `delay`:
  - `min`: (default `100`): Minimum delay in milliseconds.
  - `max`: (default `500`): Maximum delay in milliseconds.

## Examples

Use the plugin with default options.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.humanize.click()],
});
// ...
```

Use the plugin and specify the delay between `50` and `200` milliseconds.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.humanize.click({ delay: { min: 50, max: 200 } })],
});
// ...
```
