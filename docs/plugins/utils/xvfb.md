# `utils/xvfb`

> [!IMPORTANT]
>
> You need to install 📦
> [`Xvfb`](https://www.x.org/archive/X11R7.7/doc/man/man1/Xvfb.1.xhtml) package
> in your Linux : `sudo apt-get install xvfb` (on Debian/Ubuntu).

Start an instance of `Xvfb` and launches the browser in this virtual
framebuffer.

## Options

This plugin supports the following option:

- `args` (default `["-screen", "0", "1920x1080x24"]`): Arguments passed to the
  executable
  [`Xvfb`](https://www.x.org/archive/X11R7.7/doc/man/man1/Xvfb.1.xhtml).
- `keepalive` (default `false`): Keep the `Xvfb` instance alive after the
  browser is closed. If this option is enabled, it's advisable to also provide a
  `signal` to stop the `Xvfb` executable manually.
- `signal`: Signal to stop the `Xvfb` instance. Works in the same way as the
  [`signal`](https://developer.mozilla.org/Web/API/RequestInit#signal) parameter
  of [`fetch()`](https://developer.mozilla.org/Web/API/Window/fetch).

## Examples

Use the plugin with default options.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.utils.xvfb()],
});
// ...
```

Use the plugin and specify arguments for a 2K screen.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [plugins.utils.xvfb({ args: ["-screen", "0", "2560x1440x24"] })],
});
// ...
```

Use the plugin with `keepalive` and `signal`.

```javascript
import { chromium, plugins } from "playwright-ghost";

const controller = new AbortController();

// Launch a browser and start Xvfb.
const browser = await chromium.launch({
  plugins: [
    plugins.utils.xvfb({
      keepalive: true,
      signal: controller.signal,
    }),
  ],
});
// ...
// Close the browser, but don't stop Xvfb.
browser.close();

// Launch an other browser and reuse Xvfb.
const otherBrowser = await chromium.launch({
  plugins: [
    plugins.utils.xvfb({
      keepalive: true,
      signal: controller.signal,
    }),
  ],
});
// ...
// Close the other browser, but don't stop Xvfb.
otherBrowser.close();

// Stop Xvfb.
controller.abort();
```
