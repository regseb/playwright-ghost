# `utils.debug`

Display messages from the browser console in the program console.

## Options

This plugin has no option.

## Example

Use the plugin.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.utils.debug()],
});
// ...
```
