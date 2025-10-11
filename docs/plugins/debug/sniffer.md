# `debug.sniffer`

Monitor all JavaScript properties used in a page. This plugin adds the `sniffer`
property to the [`Page`](https://playwright.dev/docs/api/class-page) class, with
two methods:

- `get()`: get the list of properties;
- `reset()`: reset the list.

This plugin isn't recommended for use in production.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.debug.sniffer()],
});
const context = await browser.newContext();
const page = await context.newPage();
await page.goto("https://www.wikipedia.org/");
console.log(page.sniffer.get());
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/debug/sniffer"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import snifferPlugin from "playwright-ghost/plugins/debug/sniffer";

const browser = await chromium.launch({
  plugins: [snifferPlugin()],
});
// ...
```
