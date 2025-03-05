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
  - `screen`: `polyfill/screen` plugins options.
  - `viewport`: `polyfill/viewport` plugins options.
- `humanize`:
  - `click`: `humanize/click` plugins options.
  - `cursor`: `humanize/cursor` plugins options.
  - `dialog`: `humanize/dialog` plugins options.

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

Use the preset and specify `polyfill/screen`, `humanize/click` and
`humanize/cursor` plugin options.

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
  ),
});
// ...
```

Use all recommended plugins except `humanize/cursor`.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: plugins.recommended({
    humanize: {
      cursor: false,
    },
  ),
});
// ...
```
