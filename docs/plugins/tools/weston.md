# `tools.weston`

> [!IMPORTANT]
>
> You need to install [`weston`](https://wayland.pages.freedesktop.org/weston/)
> in your Linux:
>
> - Debian/Ubuntu: `sudo apt-get install weston`
> - Arch: `sudo pacman -S weston`

Start an instance of `weston` (a Wayland compositor) and launches the browser in
this virtual framebuffer. This plugin is only useful in headful mode.

## Options

This plugin supports the following option:

- `args` (default `["--width", "1920", "--height", "1080"]`): Arguments passed
  to the executable
  [`weston`](https://manpages.debian.org/weston/weston.1.en.html).
- `keepalive` (default `false`): Keep the `weston` instance alive after the
  browser is closed. If this option is enabled, it's advisable to also provide a
  `signal` to stop the `weston` executable manually.
- `signal`: Signal to stop the `weston` instance. Works in the same way as the
  [`signal`](https://developer.mozilla.org/Web/API/RequestInit#signal) parameter
  of [`fetch()`](https://developer.mozilla.org/Web/API/Window/fetch).

## Examples

Use the plugin with default options.

```javascript
import { chromium } from "playwright-ghost";
import toolsWestonPlugin from "playwright-ghost/plugins/tools/weston";

const browser = await chromium.launch({
  headless: false,
  plugins: [toolsWestonPlugin()],
});
// ...
```

Use the plugin and specify arguments for a 2K screen.

```javascript
import { chromium } from "playwright-ghost";
import toolsWestonPlugin from "playwright-ghost/plugins/tools/weston";

const browser = await chromium.launch({
  headless: false,
  plugins: [
    toolsWestonPlugin({ args: ["--width", "2560", "--height", "1440"] }),
  ],
});
// ...
```

Use the plugin with `keepalive` and `signal`.

```javascript
import { chromium } from "playwright-ghost";
import toolsWestonPlugin from "playwright-ghost/plugins/tools/weston";

const controller = new AbortController();

// Launch a browser and start weston.
const browser = await chromium.launch({
  headless: false,
  plugins: [toolsWestonPlugin({ keepalive: true, signal: controller.signal })],
});
// ...
// Close the browser, but don't stop weston.
browser.close();

// Launch an other browser and reuse weston.
const otherBrowser = await chromium.launch({
  headless: false,
  plugins: [toolsWestonPlugin({ keepalive: true, signal: controller.signal })],
});
// ...
// Close the other browser, but don't stop weston.
otherBrowser.close();

// Stop weston.
controller.abort();
```
