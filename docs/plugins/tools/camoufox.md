# `tools.camoufox`

> [!IMPORTANT]
>
> You need to add [`camoufox`](https://www.npmjs.com/package/camoufox) package
> to your npm dependencies.

Replace Firefox by [Camoufox](https://camoufox.com/).

## Options

This plugin supports the
[Camoufox's options](https://github.com/daijro/camoufox/tree/main/typescript#launch-options)
(`os`, `headless`, `gpu`, `require_gpu`, `proxy`...).

## Examples

Use the plugin with default options.

```javascript
import { firefox } from "playwright-ghost";
import toolsCamoufoxPlugin from "playwright-ghost/plugins/tools/camoufox";

const browser = await firefox.launch({
  plugins: [toolsCamoufoxPlugin()],
});
// ...
```

Use the plugin and set options for fingerprint generation randomly from a list
of OS.

```javascript
import { firefox } from "playwright-ghost";
import toolsCamoufoxPlugin from "playwright-ghost/plugins/tools/camoufox";

const browser = await firefox.launch({
  plugins: [toolsCamoufoxPlugin({ os: ["macos", "linux"] })],
});
// ...
```
