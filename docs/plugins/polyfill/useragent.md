# `polyfill.userAgent`

Change the browser's
[user agent](https://developer.mozilla.org/docs/Glossary/User_agent).

## Options

This plugin supports the following option:

- `userAgent`: User agent value.

## Examples

Use the plugin and specify a Chrome user agent on Windows.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [
    plugins.polyfill.userAgent({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML," +
        " like Gecko) Chrome/134.0.0.0 Safari/537.36",
    }),
  ],
});
// ...
```

Use the plugin and specify the current Chromium user agent without `"Headless"`.

```javascript
import { chromium, plugins } from "playwright-ghost";

const getUserAgent = async () => {
  const browser = await chromium.launch({ channel: "chromium" });
  const context = await browser.newContext();
  const page = await context.newPage();
  const userAgent = await page.evaluate("navigator.userAgent");
  await context.close();
  await browser.close();
  return userAgent.replace("Headless", "");
};

const browser = await chromium.launch({
  plugins: [
    plugins.polyfill.userAgent({
      userAgent: await getUserAgent(),
    }),
  ],
});
// ...
```
