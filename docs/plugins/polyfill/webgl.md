# `polyfill.webGL`

> [!NOTE]
>
> This plugin only applies to Chromium.

Modify WebGL parameter values.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [plugins.polyfill.webGL()],
});
// ...
```

## Advanced

### Import

If you want to import only this plugin, you can use the
`"playwright-ghost/plugins/polyfill/webgl"` path in the import.

```javascript
import { chromium } from "playwright-ghost";
import webGLPlugin from "playwright-ghost/plugins/polyfill/webgl";

const browser = await chromium.launch({
  plugins: [webGLPlugin()],
});
// ...
```
