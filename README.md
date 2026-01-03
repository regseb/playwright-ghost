# Playwright-ghost

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html -->
<img src="asset/logo.svg" align="right" width="100" height="100" alt="">

[![npm][img-npm]][link-npm] [![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage] [![semver][img-semver]][link-semver]

Playwright-ghost is an overlay on [Playwright](https://playwright.dev/), adding
plugins to conceal the differences between a browser used by a human being and a
[headless browser](https://en.wikipedia.org/wiki/Headless_browser) controlled by
a program.

The Playwright-ghost API is identical to that of Playwright, except for the
addition of the `plugins` option to the
[`BrowserType.launch([options])`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch)
and
[`BrowserType.launchPersistentContext(userDataDir, [options])`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context)
methods.

The `plugins` property is an array containing the plugins to be added.

## Disclaimer

This project is not officially commissioned or supported by Microsoft and
Playwright.

## Install

[`playwright-ghost`](https://www.npmjs.com/package/playwright-ghost) doesn't
provide [`playwright`](https://www.npmjs.com/package/playwright), so you need to
add it to your dependencies.

```shell
npm install playwright playwright-ghost
```

`playwright-ghost` can also be used with
[`patchright`](https://www.npmjs.com/package/patchright) or
[`rebrowser-playwright`](https://www.npmjs.com/package/rebrowser-playwright).

```shell
npm install patchright playwright-ghost
npm install rebrowser-playwright playwright-ghost
```

## Use

Here's an example with the recommended plugins.

```javascript
import { chromium } from "playwright-ghost";
// Or to use patchright or rebrowser-playwright:
// import { chromium } from "playwright-ghost/patchright";
// import { chromium } from "playwright-ghost/rebrowser";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: plugins.recommended(),
});
const context = await browser.newContext();
const page = await context.newPage();

await page.goto("https://example.com/");
const title = await page.locator("h1").textContent();
console.log(title);

await context.close();
await browser.close();
```

In this other example, three plugins are added:

- `polyfill.headless` has no options;
- `polyfill.screen` sets other values for screen size;
- `utils.adblocker` uses default options.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [
    plugins.polyfill.headless(),
    plugins.polyfill.screen({ width: 2560, height: 1440 }),
    plugins.utils.adblocker(),
  ],
});
// ...
```

And for this example, the recommended plugins and the `utils.locale` plugin are
added.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";

const browser = await chromium.launch({
  plugins: [...plugins.recommended(), plugins.utils.locale()],
});
// ...
```

## Plugins

⭐️ is in [`recommended`](docs/plugins/recommended.md) / ⚙️ has options

### Polyfill

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>⭐️</td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/automation.md">
        <code>polyfill.automation</code>
      </a>
    </td>
    <td>Disable <code>--enable-automation</code> in Chromium.</td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/headless.md">
        <code>polyfill.headless</code>
      </a>
    </td>
    <td>
      Correct many differences in JavaScript APIs between the headful and
      headless versions of Chromium.
    </td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/polyfill/screen.md"><code>polyfill.screen</code></a>
    </td>
    <td>Set a realistic value for screen size: 1920x1080.</td>
  </tr>
  <tr>
    <td>️</td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/polyfill/useragent.md">
        <code>polyfill.userAgent</code>
      </a>
    </td>
    <td>Change the browser's user agent.</td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/polyfill/viewport.md">
        <code>polyfill.viewport</code>
      </a>
    </td>
    <td>
      Vary viewport size with random values between 1000x500 and 1800x800.
    </td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/webdriver.md">
        <code>polyfill.webdriver</code>
      </a>
    </td>
    <td>Set <code>navigator.webdriver</code> to <code>false</code>.</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/webgl.md"><code>polyfill.webGL</code></a>
    </td>
    <td>Modify WebGL parameter values.</td>
  </tr>
</table>

### Humanize

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/humanize/click.md"><code>humanize.click</code></a>
    </td>
    <td>
      Add delay between <code>mousedown</code> and <code>mouseup</code> for
      clicks and double-clicks.
    </td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/humanize/cursor.md"><code>humanize.cursor</code></a>
    </td>
    <td>Move the cursor with human-like movements.</td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/humanize/dialog.md"><code>humanize.dialog</code></a>
    </td>
    <td>
      Close <code>&lt;dialog&gt;</code> within a humanly possible time (between
      1 and 5 seconds).
    </td>
  </tr>
</table>

### Utils

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td></td>
    <td>️⚙️</td>
    <td>
      <a href="docs/plugins/utils/adblocker.md"><code>utils.adblocker</code></a>
    </td>
    <td>Add Ghostery adblocker.</td>
  </tr>
  <tr>
    <td></td>
    <td>️⚙️</td>
    <td>
      <a href="docs/plugins/utils/camoufox.md"><code>utils.camoufox</code></a>
    </td>
    <td>Replace Firefox by Camoufox.</td>
  </tr>
  <tr>
    <td></td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/utils/fingerprint.md">
        <code>utils.fingerprint</code>
      </a>
    </td>
    <td>Change the browser fingerprint.</td>
  </tr>
  <tr>
    <td></td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/utils/locale.md"><code>utils.locale</code></a>
    </td>
    <td>Use the locally installed browser.</td>
  </tr>
  <tr>
    <td></td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/utils/weston.md"><code>utils.weston</code></a>
    </td>
    <td>Run browser in <code>weston</code> (a Wayland compositor).</td>
  </tr>
  <tr>
    <td></td>
    <td>⚙️</td>
    <td>
      <a href="docs/plugins/utils/xvfb.md"><code>utils.xvfb</code></a>
    </td>
    <td>Run browser in <code>Xvfb</code> (<em>X Virtual Frame Buffer</em>).</td>
  </tr>
</table>

### Debug

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td></td>
    <td>️⚙️</td>
    <td>
      <a href="docs/plugins/debug/console.md"><code>debug.console</code></a>
    </td>
    <td>
      Display console messages and error from the browser in the program
      console.
    </td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>
      <a href="docs/plugins/debug/cursor.md"><code>debug.cursor</code></a>
    </td>
    <td>Show cursor in page.</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>
      <a href="docs/plugins/debug/sniffer.md"><code>debug.sniffer</code></a>
    </td>
    <td>Monitor all JavaScript properties used in a page.</td>
  </tr>
</table>

## Anti-bots

### Pass

This 24 anti-bots don't detect Playwright-ghost:
[Anubis](https://anubis.techaro.lol),
[Bing](https://www.bing.com/turing/captcha/challenge),
[bounty-nodejs](https://bounty-nodejs.datashield.co/),
[Brotector](https://kaliiiiiiiiii.github.io/brotector/),
[BrowserScan](https://www.browserscan.net/bot-detection),
[Chromedriver Detector](https://hmaker.github.io/selenium-detector/),
[Detect CDP](https://bypassantibot.github.io/detectCDP/),
[detectIncognito](https://detectincognito.com/),
[Deviceandbrowserinfo](https://deviceandbrowserinfo.com/are_you_a_bot),
[Device Info](https://www.deviceinfo.me/)
[Disable-devtool](https://theajack.github.io/disable-devtool/),
[Fingerprint](https://fingerprint.com/products/bot-detection/),
[Fingerprint Pro Playground](https://demo.fingerprint.com/playground),
[Fingerprint-Scan](https://fingerprint-scan.com/),
[HeadlessDetectJS](https://github.com/LouisKlimek/HeadlessDetectJS),
[infosimples](https://infosimples.github.io/detect-headless/),
[Chrome Headless Detection (Intoli)](https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.html),
[Check browser fingerprints (iphey)](https://iphey.com/),
[OverpoweredJS Fingerprinting Demo](https://overpoweredjs.com/demo.html),
[Pixelscan](https://pixelscan.net/fingerprint-check),
[rebrowser-bot-detector](https://bot-detector.rebrowser.net/),
[Antibot (Sannysoft)](https://bot.sannysoft.com/),
[Simple Service Workers Fingerprinting Leaks Test](https://mihneamanolache.github.io/simple-sw-test/)
and
[Cloudflare turnstile demo](https://peet.ws/turnstile-test/non-interactive.html).

To find out which plugins are used, see the
[anti-bots integration tests](test/integration/antibots).

### Fail

This 2 anti-bots detect Playwright-ghost:

- [CreepJS](https://abrahamjuliot.github.io/creepjs/): _44% like headless_
- [Score detector (reCAPTCHA v3)](https://antcpt.com/score_detector/): _0.3_

Contributions are welcome to fix these defects.

## Customize

You can write your own plugins. A plugin is a function that returns an object
containing the hooks. The keys of this object are made up of the class, method
and hook type. For example:

- `"BrowserType.launch:before"`: modify the input arguments of the `launch()`
  method of the `BrowserType` class.
- `"BrowserContext.newPage:after"`: modify the return parameter of the
  `newPage()` method of the `BrowserContext` class.

The values of the object are functions applying the modifications.

- For `"before"` types, the function receives an array containing the arguments
  of the hooked method. And it must return a new array containing the modified
  arguments.
- For `"after"` types, the function receives the return value of the hooked
  method. And it must return the modified return value.

```javascript
/// rickrollPlugin.js
export default function rickrollPlugin() {
  return {
    "BrowserType.launch:before": (args) => {
      return [
        {
          ...args[0],
          args: ["--disable-volume-adjust-sound"],
        },
      ];
    },

    "BrowserContext.newPage:after": (page) => {
      page.addInitScript(() => {
        // Execute script only in main frame.
        if (window !== top) {
          return;
        }
        addEventListener("load", () => {
          const iframe = document.createElement("iframe");
          iframe.src = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
          document.body.replaceChildren(iframe);
        });
      });
      return page;
    },
  };
}
```

To use your plugin, add it to the `plugins` option.

```javascript
import { chromium } from "playwright-ghost";
import plugins from "playwright-ghost/plugins";
import rickrollPlugin from "./rickrollPlugin.js";

const browser = await chromium.launch({
  plugins: [...plugins.recommended(), rickrollPlugin()],
});
// ...
```

This plugin isn't perfect, so
[let's see how we can improve it](docs/customize.md) (and also discover other
features).

[img-npm]:
  https://img.shields.io/npm/dm/playwright-ghost?label=npm&logo=npm&logoColor=whitesmoke
[img-build]:
  https://img.shields.io/github/actions/workflow/status/regseb/playwright-ghost/ci.yml?branch=main&logo=github&logoColor=whitesmoke
[img-coverage]:
  https://img.shields.io/endpoint?label=coverage&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fplaywright-ghost%2Fmain
[img-semver]:
  https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&logoColor=whitesmoke
[link-npm]: https://www.npmjs.com/package/playwright-ghost
[link-build]:
  https://github.com/regseb/playwright-ghost/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]:
  https://dashboard.stryker-mutator.io/reports/github.com/regseb/playwright-ghost/main
[link-semver]: https://semver.org/spec/v2.0.0.html "Semantic Versioning 2.0.0"
