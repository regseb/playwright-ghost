# Playwright-ghost

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" alt="">

[![npm][img-npm]][link-npm] [![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage] [![semver][img-semver]][link-semver]

Playwright-ghost is an overlay on [Playwright](https://playwright.dev/), adding
plugins to conceal the differences between a browser used by a human being and a
[headless browser](https://en.wikipedia.org/wiki/Headless_browser) controlled by
a program.

The Playwright-ghost API is identical to that of Playwright, except for the
addition of the `plugins` option to the
[`browserType.launch([options])`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch)
and
[`browserType.launchPersistentContext(userDataDir, [options])`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context)
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
import { chromium, plugins } from "playwright-ghost";
// Or to use patchright or rebrowser-playwright:
// import { chromium, plugins } from "playwright-ghost/patchright";
// import { chromium, plugins } from "playwright-ghost/rebrowser";

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
import { chromium, plugins } from "playwright-ghost";

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
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [...plugins.recommended(), plugins.utils.locale()],
});
// ...
```

## Plugins

⭐ is in [`recommended`](docs/plugins/recommended.md) / ⚙️ has options / 📦
requires external tool

### Polyfill

<!-- markdownlint-disable no-inline-html-->
<table>
  <tr>
    <td>⭐</td>
    <td>⚙️</td>
    <td>📦</td>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>⭐</td>
    <td></td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/automation.md"
        ><code>polyfill.automation</code></a>
    </td>
    <td>Disable <code>--enable-automation</code> in Chromium.</td>
  </tr>
  <tr>
    <td>⭐</td>
    <td></td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/headless.md"
        ><code>polyfill.headless</code></a>
    </td>
    <td>
      Correct many differences in JavaScript APIs between the headful and
      headless versions of Chromium.
    </td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/screen.md"><code>polyfill.screen</code></a>
    </td>
    <td>
      Set a realistic value for screen size: 1920x1080.
    </td>
  </tr>
  <tr>
    <td>️</td>
    <td>⚙️</td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/useragent.md"
        ><code>polyfill.userAgent</code></a>
    </td>
    <td>
      Change the browser's user agent.
    </td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/viewport.md"
        ><code>polyfill.viewport</code></a>
    </td>
    <td>
      Vary viewport size with random values between 1000x500 and 1800x800.
    </td>
  </tr>
  <tr>
    <td>⭐</td>
    <td></td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/webdriver.md"
        ><code>polyfill.webdriver</code></a>
    </td>
    <td>
      Set <code>navigator.webdriver</code> to <code>false</code>.
    </td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td>
      <a href="docs/plugins/polyfill/webgl.md"><code>polyfill.webGL</code></a>
    </td>
    <td>
      Modify WebGL parameter values.
    </td>
  </tr>
</table>

### Humanize

<!-- markdownlint-disable no-inline-html-->
<table>
  <tr>
    <td>⭐</td>
    <td>⚙️</td>
    <td>📦</td>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td></td>
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
    <td></td>
    <td>
      <a href="docs/plugins/humanize/cursor.md"><code>humanize.cursor</code></a>
    </td>
    <td>
      Move the cursor with human-like movements.
    </td>
  </tr>
  <tr>
    <td>⭐️</td>
    <td>⚙️</td>
    <td></td>
    <td>
      <a href="docs/plugins/humanize/dialog.md"
        ><code>humanize.dialog</code></a>
    </td>
    <td>
      Close <code>&lt;dialog&gt;</code> within a humanly possible time (between
      1 and 5 seconds).
    </td>
  </tr>
</table>

### Utils

<!-- markdownlint-disable no-inline-html-->
<table>
  <tr>
    <td>⭐</td>
    <td>⚙️</td>
    <td>📦</td>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td></td>
    <td>️⚙️</td>
    <td>📦</td>
    <td>
      <a href="docs/plugins/utils/adblocker.md"
        ><code>utils.adblocker</code></a>
    </td>
    <td>
      Add Ghostery adblocker.
    </td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td>
      <a href="docs/plugins/utils/debug.md"><code>utils.debug</code></a>
    </td>
    <td>
      Display messages from the browser console in the program console.
    </td>
  </tr>
  <tr>
    <td></td>
    <td>⚙️</td>
    <td>📦</td>
    <td>
      <a href="docs/plugins/utils/fingerprint.md"><code>utils.fingerprint</code></a>
    </td>
    <td>
      Change the browser fingerprint.
    </td>
  </tr>
  <tr>
    <td></td>
    <td>⚙️</td>
    <td></td>
    <td>
      <a href="docs/plugins/utils/locale.md"><code>utils.locale</code></a>
    </td>
    <td>
      Use the locally installed browser.
    </td>
  </tr>
  <tr>
    <td></td>
    <td>⚙️</td>
    <td>📦</td>
    <td>
      <a href="docs/plugins/utils/xvfb.md"><code>utils.xvfb</code></a>
    </td>
    <td>
      Run browser in <code>Xvfb</code> (<em>X Virtual Frame Buffer</em>).
    </td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html-->

## Anti-bots

<!-- markdownlint-disable no-inline-html-->
<table>
  <tr>
    <td><a href="https://kaliiiiiiiiii.github.io/brotector/">Brotector</a></td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td><a href="https://www.browserscan.net/bot-detection">BrowserScan</a></td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://hmaker.github.io/selenium-detector/"
        >Chromedriver Detector</a
      >
    </td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td><a href="https://abrahamjuliot.github.io/creepjs/">CreepJS</a></td>
    <td>❌</td>
    <td><em>F</em></td>
  </tr>
  <tr>
    <td><a href="https://antoinevastel.com/bots/datadome">Datadome</a></td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://deviceandbrowserinfo.com/are_you_a_bot"
        >Deviceandbrowserinfo</a
      >
    </td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td><a href="https://www.deviceinfo.me/">Device Info</a></td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://fingerprint.com/products/bot-detection/"
        >Fingerprint</a
      >
    </td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://fingerprint.com/products/bot-detection/"
        >Fingerprint Pro Playground</a
      >
    </td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td><a href="https://fingerprint-scan.com/">Fingerprint-Scan</a></td>
    <td>❌</td>
    <td>20</td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/LouisKlimek/HeadlessDetectJS"
        >HeadlessDetectJS</a
      >
    </td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://infosimples.github.io/detect-headless/">infosimples</a>
    </td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a
        href="https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.html"
        >Chrome Headless Detection (Intoli)</a
      >
    </td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://overpoweredjs.com/demo.html"
        >OverpoweredJS Fingerprinting Demo</a
      >
    </td>
    <td>❌</td>
    <td><em>Bot (5)</em></td>
  </tr>
  <tr>
    <td><a href="https://pixelscan.net/">Pixelscan</a></td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://bot-detector.rebrowser.net/"
        >rebrowser-bot-detector</a
      >
    </td>
    <td>❌</td>
    <td>
      <em>mainWorldExecution</em>, <em>runtimeEnableLeak</em> &amp;
      <em>pwInitScripts</em>
    </td>
  </tr>
  <tr>
    <td><a href="https://bot.sannysoft.com/">Antibot (Sannysoft)</a></td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://mihneamanolache.github.io/simple-sw-test/">Simple Service Workers Fingerprinting Leaks Test</a>
    </td>
    <td>✅</td>
    <td></td>
  </tr>
  <tr>
    <td>
      <a href="https://antcpt.com/score_detector/"
        >Score detector (reCAPTCHA v3)</a
      >
    </td>
    <td>❌</td>
    <td><em>0.3</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://peet.ws/turnstile-test/non-interactive.html"
        >Cloudflare turnstile demo</a
      >
    </td>
    <td>✅</td>
    <td></td>
  </tr>
</table>

To find out which plugins are used, see the
[anti-bots integration tests](test/integration/antibots).

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
