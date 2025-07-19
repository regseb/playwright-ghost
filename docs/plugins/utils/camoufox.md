# `utils.camoufox`

Replace Firefox by [Camoufox](https://camoufox.com/) (using
[`camoufox-js`](https://www.npmjs.com/package/camoufox-js)).

## Options

This plugin supports the following option (from Camoufox):

- Device Rotation: [`os`](https://camoufox.com/python/usage/#os),
  [`fonts`](https://camoufox.com/python/usage/#fonts),
  [`screen`](https://camoufox.com/python/usage/#screen),
  [`webgl_config`](https://camoufox.com/python/usage/#webgl_config),
  [`config`](https://camoufox.com/python/usage/#config);
- Configuration: [`humanize`](https://camoufox.com/python/usage/#humanize),
  [`headless`](https://camoufox.com/python/usage/#headless),
  [`addons`](https://camoufox.com/python/usage/#addons),
  [`exclude_addons`](https://camoufox.com/python/usage/#exclude_addons),
  [`window`](https://camoufox.com/python/usage/#window),
  [`main_world_eval`](https://camoufox.com/python/usage/#main_world_eval),
  [`enable_cache`](https://camoufox.com/python/usage/#enable_cache),
  [`persistent_context`](https://camoufox.com/python/usage/#persistent_context);
- Location & Language: [`geoip`](https://camoufox.com/python/usage/#geoip),
  [`locale`](https://camoufox.com/python/usage/#locale);
- Toggles: [`block_images`](https://camoufox.com/python/usage/#block_images),
  [`block_webrtc`](https://camoufox.com/python/usage/#block_webrtc),
  [`block_webgl`](https://camoufox.com/python/usage/#block_webgl),
  [`disable_coop`](https://camoufox.com/python/usage/#disble_coop).

## Examples

Use the plugin with default options.

```javascript
import { chromium } from "playwright-ghost";
import { plugins } from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.camoufox()],
});
// ...
```

Use the plugin and set options for fingerprint generation randomly from a list
of OS.

```javascript
import { chromium } from "playwright-ghost";
import { plugins } from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.utils.camoufox({ os: ["macos", "linux"] })],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/utils/camoufox"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import camoufoxPlugin from "playwright-ghost/plugins/utils/camoufox";

const browser = await chromium.launch({
  plugins: [camoufoxPlugin()],
});
// ...
```

### Version

If you want to use a specific version of
[`camoufox-js`](https://www.npmjs.com/package/camoufox-js)), you can use the
[`overrides`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides)
property in your _package.json_. In this example, the dependency version is set
to `0.6.1`.

```json
{
  "name": "your-awesome-project",
  "dependencies": {
    "playwright-ghost": "0.14.0"
  },
  "overrides": {
    "playwright-ghost": {
      "camoufox-js": "0.6.1"
    }
  }
}
```
