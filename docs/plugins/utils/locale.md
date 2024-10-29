# `utils/locale`

Use the locally installed browser.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.utils.locale()],
});
// ...
```
