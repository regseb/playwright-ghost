# `tools.adblocker`

> [!IMPORTANT]
>
> You need to add
> [`@ghostery/adblocker-playwright`](https://www.npmjs.com/package/@ghostery/adblocker-playwright)
> package to your npm dependencies.

Add
[Ghostery adblocker](https://github.com/ghostery/adblocker/tree/master/packages/adblocker-playwright#readme)
in browser.

## Options

This plugin supports the following option:

- `mode` (default `"fromPrebuiltAdsAndTracking"`): Rules loading mode. Possible
  values are: `"parse"`, `"fromLists"`, `"fromPrebuiltAdsOnly"`,
  `"fromPrebuiltAdsAndTracking"` and `"fromPrebuiltFull"`.

## Examples

Use the plugin with default options.

```javascript
import { chromium } from "playwright-ghost";
import toolsAdblockerPlugin from "playwright-ghost/plugins/tools/adblocker";

const browser = await chromium.launch({
  plugins: [toolsAdblockerPlugin()],
});
// ...
```

Use the plugin and specify `"fromPrebuiltFull"` mode.

```javascript
import { chromium } from "playwright-ghost";
import toolsAdblockerPlugin from "playwright-ghost/plugins/tools/adblocker";

const browser = await chromium.launch({
  plugins: [toolsAdblockerPlugin({ mode: "fromPrebuiltFull" })],
});
// ...
```
