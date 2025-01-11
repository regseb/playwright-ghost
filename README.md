# Playwright-ghost

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" alt="">

[![npm][img-npm]][link-npm] [![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage] [![semver][img-semver]][link-semver]

> [!NOTE]
>
> This project is not officially commissioned or supported by Microsoft and
> Playwright.

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

⭐ is in `recommended` / ⚙️ has options / 📦 requires dependency

<!-- markdownlint-disable no-inline-html-->
<table>
  <tr><th></th><th>Name</th><th>Description</th></tr>
  <tr>
    <td>⭐</td>
    <td>
      <a href="./docs/plugins/polyfill/automation.md"
        ><code>polyfill.automation</code></a>
    </td>
    <td>Disable <code>--enable-automation</code> in Chromium.</td>
  </tr>
  <tr>
    <td>⭐</td>
    <td>
      <a href="./docs/plugins/polyfill/headless.md"
        ><code>polyfill.headless</code></a>
    </td>
    <td>
      Correct many differences in Javascript APIs between the headful and
      headless versions of Chromium.
    </td>
  </tr>
  <tr>
    <td>⭐ ⚙️</td>
    <td>
      <a href="./docs/plugins/polyfill/screen.md"
        ><code>polyfill.screen</code></a>
    </td>
    <td>
      Set a realistic value for screen size: 1920x1080.
    </td>
  </tr>
  <tr>
    <td>⚙️</td>
    <td>
      <a href="./docs/plugins/polyfill/useragent.md"
        ><code>polyfill.userAgent</code></a>
    </td>
    <td>
      Change the browser's user agent.
    </td>
  </tr>
  <tr>
    <td>⭐ ⚙️</td>
    <td>
      <a href="./docs/plugins/polyfill/viewport.md"
        ><code>polyfill.viewport</code></a>
    </td>
    <td>
      Vary viewport size with random values between 1000x500 and 1800x800.
    </td>
  </tr>
  <tr>
    <td>⭐</td>
    <td>
      <a href="./docs/plugins/polyfill/webdriver.md"
        ><code>polyfill.webdriver</code></a>
    </td>
    <td>
      Set <code>navigator.webdriver</code> to <code>false</code>.
    </td>
  </tr>
  <tr>
    <td></td>
    <td>
      <a href="./docs/plugins/polyfill/webgl.md"><code>polyfill.webGL</code></a>
    </td>
    <td>
      Modify WebGL parameter values.
    </td>
  </tr>
  <tr>
    <td>⭐ ⚙️</td>
    <td>
      <a href="./docs/plugins/humanize/click.md"><code>humanize.click</code></a>
    </td>
    <td>
      Add delay between <code>mousedown</code> and <code>mouseup</code> for
      clicks and double-clicks.
    </td>
  </tr>
  <tr>
    <td>⭐ ⚙️</td>
    <td>
      <a href="./docs/plugins/humanize/dialog.md"
        ><code>humanize.dialog</code></a>
    </td>
    <td>
      Close <code>&lt;dialog&gt;</code> within a humanly possible time (between
      1 and 5 seconds).
    </td>
  </tr>
  <tr>
    <td>⚙️ 📦</td>
    <td>
      <a href="./docs/plugins/utils/adblocker.md"
        ><code>utils.adblocker</code></a>
    </td>
    <td>
      Add Ghostery adblocker.
    </td>
  </tr>
  <tr>
    <td></td>
    <td>
      <a href="./docs/plugins/utils/debug.md"><code>utils.debug</code></a>
    </td>
    <td>
      Display messages from the browser console in the program console.
    </td>
  </tr>
  <tr>
    <td></td>
    <td>
      <a href="./docs/plugins/utils/locale.md"><code>utils.locale</code></a>
    </td>
    <td>
      Use the locally installed browser.
    </td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html-->

## Anti-bots

<!-- markdownlint-disable no-inline-html-->
<table>
  <tr>
    <th></th>
    <th>Chromiumᵃ</th>
    <th>Firefoxᵇ</th>
  </tr>
  <tr>
    <td>
      <a href="https://kaliiiiiiiiii.github.io/brotector/?crash=false"
        >Brotector</a
      >
    </td>
    <td>
      ❌¹ <em>0.98</em> (<em>UA_Override</em> & <em>Input.cordinatesLeak</em>)
    </td>
    <td>
      ❌ <em>1.00</em> (<em>navigator.webdriver</em> & <em>PWinitScript</em>)
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.browserscan.net/bot-detection">BrowserScan</a>
    </td>
    <td>✅</td>
    <td>❌ <em>WebDriver</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://hmaker.github.io/selenium-detector/"
        >Chromedriver Detector<a
      >
    </td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>
      <a href="https://abrahamjuliot.github.io/creepjs/">CreepJS</a>
    </td>
    <td>✅ <em>B-</em></td>
    <td>❌ <em>F+</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://antoinevastel.com/bots/datadome">Datadome</a>
    </td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>
      <a href="https://deviceandbrowserinfo.com/are_you_a_bot"
        >Deviceandbrowserinfo</a
      >
    </td>
    <td>❌ <em>GPU</em></td>
    <td>❌ <em>Webdriver</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://www.deviceinfo.me/">Device Info</a>
    </td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>
      <a href="https://fingerprint.com/products/bot-detection/"
        >FingerprintJS</a
      >
    </td>
    <td>✅</td>
    <td>❌ <em>Automation Tool</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/LouisKlimek/HeadlessDetectJS"
        >HeadlessDetectJS</a
      >
    </td>
    <td>✅</td>
    <td>❌ <em>0.2</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://infosimples.github.io/detect-headless/">infosimples</a>
    </td>
    <td>✅</td>
    <td>❌ <em>Webdriver</em> & <em>Plugins</em></td>
  </tr>
  <tr>
    <td>
      <a
        href="https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.html"
        >Chrome Headless Detection (Intoli)</a
      >
    </td>
    <td>✅</td>
    <td>❌ <em>WebDriver</em> & <em>Plugins</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://rebrowser.github.io/rebrowser-bot-detector/"
        >rebrowser-bot-detector</a
      >
    </td>
    <td>❌ <em>pwInitScripts</em></td>
    <td>❌ <em>navigatorWebdriver</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://bot.sannysoft.com/">Antibot (Sannysoft)</a>
    </td>
    <td>✅</td>
    <td>❌ <em>Webdriver</em> & <em>Plugins</em></td>
  </tr>
  <tr>
    <td>
      <a href="https://peet.ws/turnstile-test/non-interactive.html"
        >Cloudflare turnstile demo</a
      >
    </td>
    <td>✅</td>
    <td>✅</td>
  </tr>
</table>

ᵃ Chromium with `rebrowser-playwright`, recommended plugins and the
`polyfill.userAgent` plugin (to remove _Headless_).\
ᵇ Firefox with `playwright` and recommended plugins.\
¹ Without [_popupCrash_](https://github.com/kaliiiiiiiiii/brotector#popupcrash).

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
