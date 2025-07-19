# `utils.fingerprint`

Change the browser fingerprint with
[Fingerprint Suite](https://github.com/apify/fingerprint-suite#readme) (using
[`fingerprint-generator`](https://www.npmjs.com/package/fingerprint-generator)
and [`fingerprint-injector`](https://www.npmjs.com/package/fingerprint-injector)
packages).

## Options

This plugin supports the following option:

- `fingerprintOptions`: `fingerprintOptions` properties of the function
  `newInjectedContext()`.
- `fingerprint`: `fingerprint` properties of the function
  `newInjectedContext()`.

## Examples

Use the plugin with default options.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.fingerprint()],
});
// ...
```

Use the plugin and set options for fingerprint generation.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [
    plugins.utils.fingerprint({
      fingerprintOptions: { devices: ["mobile"], operatingSystems: ["ios"] },
    }),
  ],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/utils/fingerprint"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import fingerprintPlugin from "playwright-ghost/plugins/utils/fingerprint";

const browser = await chromium.launch({
  plugins: [fingerprintPlugin()],
});
// ...
```

### Version

If you want to use a specific version of
[`fingerprint-generator`](https://www.npmjs.com/package/fingerprint-generator)
and
[`fingerprint-injector`](https://www.npmjs.com/package/fingerprint-injector),
you can use the
[`overrides`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides)
property in your _package.json_. In this example, dependency versions are set to
`2.1.69`.

```json
{
  "name": "your-awesome-project",
  "dependencies": {
    "playwright-ghost": "0.14.0"
  },
  "overrides": {
    "playwright-ghost": {
      "fingerprint-generator": "2.1.69",
      "fingerprint-injector": "2.1.69"
    }
  }
}
```
