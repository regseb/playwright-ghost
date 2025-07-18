# `utils.adblocker`

Add
[Ghostery adblocker](https://github.com/ghostery/adblocker/tree/master/packages/adblocker-playwright#readme)
in browser (using
[`@ghostery/adblocker-playwright`](https://www.npmjs.com/package/@ghostery/adblocker-playwright)
package).

## Options

This plugin supports the following option:

- `mode` (default `"fromPrebuiltAdsAndTracking"`): Rules loading mode. Possible
  values are: `"parse"`, `"fromLists"`, `"fromPrebuiltAdsOnly"`,
  `"fromPrebuiltAdsAndTracking"` and `"fromPrebuiltFull"`.

## Examples

Use the plugin with default options.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.adblocker()],
});
// ...
```

Use the plugin and specify `"fromPrebuiltFull"` mode.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.adblocker({ mode: "fromPrebuiltFull" })],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/utils/adblocker"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import adblockerPlugin from "playwright-ghost/plugins/utils/adblocker";

const browser = await chromium.launch({
  plugins: [adblockerPlugin()],
});
// ...
```

### Version

If you want to use a specific version of
[`@ghostery/adblocker-playwright`](https://www.npmjs.com/package/@ghostery/adblocker-playwright),
you can use the
[`overrides`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides)
property in your _package.json_. In this example, the dependency version is set
to `2.11.3`.

```json
{
  "name": "your-awesome-project",
  "dependencies": {
    "playwright-ghost": "0.14.0"
  },
  "overrides": {
    "playwright-ghost": {
      "@ghostery/adblocker-playwright": "2.11.3"
    }
  }
}
```
