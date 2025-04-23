# `recommended`

This is a preset for using the recommended plugins:

- `polyfill`:
  - [`automation`](polyfill/automation.md)
  - [`headless`](polyfill/headless.md)
  - [`screen`](polyfill/screen.md)
  - [`viewport`](polyfill/viewport.md)
  - [`webdriver`](polyfill/webdriver.md)
- `humanize`:
  - [`click`](humanize/click.md)
  - [`cursor`](humanize/cursor.md)
  - [`dialog`](humanize/dialog.md)

## Options

Plugin options can be provided:

- `polyfill`:
  - `screen`: [`polyfill.screen`](polyfill/screen.md#options) plugins options.
  - `viewport`: [`polyfill.viewport`](polyfill/viewport.md#options) plugins
    options.
- `humanize`:
  - `click`: [`humanize.click`](humanize/click.md#options) plugins options.
  - `cursor`: [`humanize.cursor`](humanize/cursor.md#options) plugins options.
  - `dialog`: [`humanize.dialog`](humanize/dialog.md#options) plugins options.

Plugins can be disabled by passing the value to `false`.

## Examples

Use the preset with default options.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: plugins.recommended(),
});
// ...
```

Use the preset and specify `polyfill.screen`, `humanize.click` and
`humanize.cursor` plugin options.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: plugins.recommended({
    polyfill: {
      screen: { width: 2560, height: 1440 },
    },
    humanize: {
      click: { delay: { min: 50, max: 200 } },
      cursor: { start: { x: 100, y: 100 } },
    },
  }),
});
// ...
```

Use all recommended plugins except `polyfill.headless`.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: plugins.recommended({
    polyfill: {
      headless: false,
    },
  }),
});
// ...
```

Use all recommended plugins except `humanize` plugins (`click`, `cursor` and
`dialog`).

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: plugins.recommended({
    humanize: false,
  }),
});
// ...
```
