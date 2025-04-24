# `humanize.cursor`

> [!TIP]
>
> This plugin is enabled in the ⭐ [`recommended`](../recommended.md).

Move the cursor with human-like movements.

The following methods have been modified to add human-like movements:
[`Locator.check()`](https://playwright.dev/docs/api/class-locator#locator-check),
[`Locator.click()`](https://playwright.dev/docs/api/class-locator#locator-click),
[`Locator.dblclick()`](https://playwright.dev/docs/api/class-locator#locator-dblclick),
[`Locator.hover()`](https://playwright.dev/docs/api/class-locator#locator-hover),
[`Locator.setChecked()`](https://playwright.dev/docs/api/class-locator#locator-set-checked),
[`Locator.uncheck()`](https://playwright.dev/docs/api/class-locator#locator-uncheck),
[`Mouse.click()`](https://playwright.dev/docs/api/class-mouse#mouse-click),
[`Mouse.dblclick()`](https://playwright.dev/docs/api/class-mouse#mouse-dblclick)
and [`Mouse.move()`](https://playwright.dev/docs/api/class-mouse#mouse-move).
Deprecated methods (ex: `Page.click()`) are not modified.

## Options

This plugin supports the following option:

- `start`:
  - `x` (default to a random position): Start position _x_ of cursor.
  - `y` (default to a random position): Start position _y_ of cursor.

## Examples

Use the plugin with default options: random position in viewport.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.humanize.cursor()],
});
// ...
```

Use the plugin and specify a start position of cursor.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.humanize.cursor({ start: { x: 100, y: 100 } })],
});
// ...
```
