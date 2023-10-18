# Playwright-ghost

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" width="100" alt="">

[![build][img-build]][link-build]

Playwright-ghost est une surcouche de [Playwright](https://playwright.dev/) en
lui ajoutant une système de plugins pour gommer les différences entre un
navigateur utilisé par un être humain et un navigateur
[_headless_](https://fr.wikipedia.org/wiki/Navigateur_headless) contrôlé par
un programme.

L'API de Playwright-ghost est identique à celle de Playwright, sauf l'ajout de
l'option `plugins` à la méthode
[`browserType.launch([options])`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch).
La propriété `plugins` doit être un objet dont les clés sont les noms des
plugins ; et les valeurs :

- `true` pour activer le plugin avec ses options par défaut ;
- `false` pour désactiver le plugin ;
- un objet pour activer le plugin et définir des options (spécifiques pour
  chaque plugin).

## Plugins

💼 : Activé par défaut.\
⚙️ : Possède des options.\
📦 : Nécessite un package externe.

<table>
  <tr><th>Nom</th><th>Description</th><th></th></tr>
  <tr>
    <td><code>"polyfill/common"</code></td>
    <td>
      Corriger des nombreuses différences dans les APIs Javascript en headless.
      Par exemple <code>navigator.userAgent</code>,
      <code>navigator.mimeTypes</code>...
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/screen"</code></td>
    <td>
      Définir une valeur réaliste pour la taille de l'écran : 1920x1080. Ces
      valeur sont configurable avec les options `width` et `height`.
    </td>
    <td>💼 ⚙️</td>
  </tr>
  <tr>
    <td><code>"polyfill/useragent"</code></td>
    <td>
      Changer l'[agent
      utilisateur](https://developer.mozilla.org/docs/Glossary/User_agent)
      (_user agent_) du navigateur avec l'option `userAgent`.
    </td>
    <td>⚙️</td>
  </tr>
  <tr>
    <td><code>"polyfill/viewport"</code></td>
    <td>
      TODO Ajuster les valeurs dans la variable <code>screen</code>.
    </td>
    <td>💼 ⚙️</td>
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
  <tr>
    <td><code>"humanize/dialog"</code></td>
    <td>
      Fermer les boîtes de dialogues dans un temps humainement possible, car par
      défaut Playwright <a href="https://playwright.dev/docs/dialogs">les ferme
      immédiatement</a>.
    </td>
    <td>⚙️</td>
  </tr>
  <tr>
    <td><code>"extension/adblocker"</code></td>
    <td>
      Bloquer les publicités et les traqueurs en utilisant
      <a
      href="https://github.com/ghostery/adblocker/tree/master/packages/adblocker-playwright#readme">
      Cliqz' adblocker</a>.
    </td>
    <td>⚙️ 📦</td>
  </tr>
</table>

## Bibliographie

### Bibliothèques pour contrôler un navigateur

- [Playwright](https://playwright.dev/) : la bibliothèque utilisée par
  Playwright-ghost.
- [Puppeteer](https://pptr.dev/) : la bibliothèque dont Playwright s'est
  inspiré.

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

[img-build]: https://img.shields.io/github/actions/workflow/status/regseb/playwright-ghost/ci.yml?branch=main&logo=github&logoColor=whitesmoke
[link-build]: https://github.com/regseb/playwright-ghost/actions/workflows/ci.yml?query=branch%3Amain
