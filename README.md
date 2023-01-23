# Playwright-ghost

<!-- Utiliser du HTML pour faire flotter l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" width="100" alt="">

Playwright-ghost est une surcouche de [Playwright](https://playwright.dev/) en
lui ajoutant une système de plugins pour corriger principalement des différences
entre les versions normales des navigateurs et les versions
[_headless_](https://fr.wikipedia.org/wiki/Navigateur_headless) contrôlées par
un programme.

L'API de Playwright-ghost est identique à celle de Playwright, sauf l'ajout de
l'option `plugins` à la méthode
[`browserType.launch([options])`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch).
La propriété `plugins` doit être un objet dont les clés sont les noms des
plugins et les valeurs :

- `true` pour activer le plugin avec ses options par défaut ;
- `false` pour désactiver le plugin ;
- un objet pour activer le plugin et définir des options (spécifiques pour
  chaque plugin).

L'objet plugins peut aussi contenir la clé `"*"` pour activer ou désactiver tous
les plugins.

## Plugins

💼 : Plugin activé par défaut.

<table>
  <tr><th>Nom</th><th>Description</th><th></th></tr>
  <tr>
    <td><code>"polyfill/chrome"</code></td>
    <td>Ajouter la variable global <code>chrome</code>.</td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/maxTouchPoints"</code></td>
    <td>Définir une valeur dans <code>navigator.maxTouchPoints</code>.</td>
    <td></td>
  </tr>
  <tr>
    <td><code>"polyfill/notificationPermission"</code></td>
    <td>Corriger la valeur de <code>Notification.permission</code>.</td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/pdfViewerEnabled"</code></td>
    <td>
      Passer à <code>true</code> la valeur de
      <code>navigator.pdfViewerEnabled</code>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/plugins"</code></td>
    <td>
      Remplir les variables <code>navigator.mimeTypes</code> et
      <code>navigator.plugins</code>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/rtt"</code></td>
    <td>
      Définir une valeur autre que <code>0</code> dans la variable
      <code>navigator.connection.rtt</code>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/sharedArrayBuffer"</code></td>
    <td>
      Supprimer la classe <code>SharedArrayBuffer</code>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/userAgent"</code></td>
    <td>
      Enlever le terme <code>"Headless"</code> des variables
      <code>navigator.userAgent</code> et <code>navigator.appVersion</code>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/userAgentData"</code></td>
    <td>
      Modifier la variable <code>navigator.userAgentData</code>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/viewport"</code></td>
    <td>
      Ajuster les valeurs dans la variable <code>screen</code>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/webdriver"</code></td>
    <td>
      Passer à <code>false</code> la variable <code>navigator.webdriver</code>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/webGL"</code></td>
    <td>
      Modifier les valeurs des paramètres <em>WebGL</em>.
    </td>
    <td>💼</td>
  </tr>
</table>

## Bibliographie

### Bibliothèques pour contrôler un navigateur

- [Playwright](https://playwright.dev/) : la bibliothèque utilisée par
  Playwright-ghost.
- [Puppeteer](https://pptr.dev/) : la biblithèque dont Playwright est un fork.

### Bibliothèques pour du WebScraping

- [Puppeteer-extra](https://github.com/berstend/puppeteer-extra) : surcouche de
  Puppeteer et Playwright pour les rendre indétectable.
- [Ulixee Hero](https://github.com/ulixee/hero)
  (ex-[SecretAgent](https://github.com/ulixee/secret-agent)).
- [FakeBrowser](https://github.com/kkoooqq/fakebrowser).
- [Crawlee](https://crawlee.dev/).
- [Playwright-Stealth](https://github.com/Granitosaurus/playwright-stealth/) en
  Python.

### Anti-bots

- [CreepJS](https://abrahamjuliot.github.io/creepjs/).
- [Fingerprint](https://fingerprintjs.com/products/bot-detection/)
  ([FingerprintJS](https://fingerprintjs.github.io/fingerprintjs/)).
- [DoubleAgent](https://github.com/ulixee/unblocked/tree/main/double-agent)
  (cf. Ulixee Hero).
- [Chrome headless
  test](https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.htm)
  (cf. [article](https://intoli.com/blog/not-possible-to-block-chrome-headless/)
  d'Intoli).
- [Demo form for detecting reCAPTCHA 3
  score](https://antcpt.com/eng/information/demo-form/recaptcha-3-test-score.html).
- [Device Info](https://www.deviceinfo.me/) (si <em>Spoofed</em> apparait dans
  la page).
- [Intoli.com tests + additions](https://bot.sannysoft.com/) (Sannysoft).
- [Headless Chrome Detection Tests](https://bot.incolumitas.com/) (Incolumitas).
- [Datadome test page](https://antoinevastel.com/bots/datadome) (ex-[Your
  browser fingerprint](https://antoinevastel.com/bots)) / [You are not Chrome
  headless](https://arh.antoinevastel.com/bots/areyouheadless)
  ([API](https://antoinevastel.com/bots/areyouheadless)).
- [Detect Headless](https://infosimples.github.io/detect-headless/).

## Fingerprint

- [Pixelscan](https://pixelscan.net/).
- [Mon empreinte de navigateur](https://amiunique.org/fp).
- [tester at niespodd /
  browser-fingerprinting](https://niespodd.github.io/browser-fingerprinting).
- [Cover Your Tracks](https://coveryourtracks.eff.org/).
- [Fake Vision](http://f.vision/).
- [Rendering Engine Hackability
  Probe](https://portswigger-labs.net/hackability/).
- [Vytal](https://vytal.io/).
- [WebGL Browser Report](https://browserleaks.com/webgl).
- [Fingerprint Suite](https://apify.github.io/fingerprint-suite/).

### Autre

- [Writing bots for fun - bypassing
  hCaptcha](https://danielazulay.hashnode.dev/writing-bots-for-fun-bypassing-hcaptcha).
- [Dark Knowledge](https://github.com/prescience-data/dark-knowledge).
- [Web scraping in Javascript: node-fetch vs axios vs got vs
  superagent](https://pixeljets.com/blog/node-fetch-vs-axios-vs-got-for-web-scraping-in-node-js/)
  par [Pixeljets](https://pixeljets.com/).
- [How does PerimeterX Bot Defender
  work](https://www.trickster.dev/post/how-does-perimeterx-bot-defender-work/).
