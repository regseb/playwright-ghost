# `humanize/click`

> [!TIP]
>
> This plugin is enabled in the ⭐ recommended.

Add delay between `mousedown` and `mouseup` for
[clicks](https://playwright.dev/docs/api/class-locator#locator-click) and
[double-clicks](https://playwright.dev/docs/api/class-locator#locator-dblclick).

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
