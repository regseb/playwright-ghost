# `utils/fingerprint`

> [!IMPORTANT]
>
> You need to add 📦
> [`fingerprint-injector`](https://www.npmjs.com/package/fingerprint-injector)
> to your npm dependencies.

Change the browser fingerprint with
[Fingerprint Suite](https://github.com/apify/fingerprint-suite#readme).

## Options

This plugin supports the following option:

- `fingerprintOptions`: `fingerprintOptions` properties of the method
  `newInjectedContext()`.
- `fingerprint`: `fingerprint` properties of the method `newInjectedContext()`.

## Examples

Use the plugin with default options.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.utils.fingerprint()],
});
// ...
```

Use the plugin and set options for fingerprint generation.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [
    plugins.utils.fingerprint({
      fingerprintOptions: { devices: ["mobile"], operatingSystems: ["ios"] },
    }),
  ],
});
// ...
```
