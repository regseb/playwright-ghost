# `tools.fingerprint`

> [!IMPORTANT]
>
> You need to add
> [`fingerprint-generator`](https://www.npmjs.com/package/fingerprint-generator)
> and
> [`fingerprint-injector`](https://www.npmjs.com/package/fingerprint-injector)
> packages to your npm dependencies.

Change the browser fingerprint with
[Fingerprint Suite](https://github.com/apify/fingerprint-suite#readme).

Fingerprint is not added with
[`Browser.newPage()`](https://playwright.dev/docs/api/class-browser#browser-new-page).
You must use
[`Browser.newContext()`](https://playwright.dev/docs/api/class-browser#browser-new-context)
(after
[`BrowserType.launch()`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch))
or
[`BrowserType.launchPersistentContext()`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context).

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
import toolsFingerprintPlugin from "playwright-ghost/plugins/tools/fingerprint";

const browser = await chromium.launch({
  plugins: [toolsFingerprintPlugin()],
});
// ...
```

Use the plugin and set options for fingerprint generation.

```javascript
import { chromium } from "playwright-ghost";
import toolsFingerprintPlugin from "playwright-ghost/plugins/tools/fingerprint";

const browser = await chromium.launch({
  plugins: [
    toolsFingerprintPlugin({
      fingerprintOptions: { devices: ["mobile"], operatingSystems: ["ios"] },
    }),
  ],
});
// ...
```
