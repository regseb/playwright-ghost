# Playwright-ghost

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" alt="">

Playwright-ghost est une surcouche de [Playwright](https://playwright.dev/) en
lui ajoutant un système de plugins pour gommer les différences entre un
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

## Installation

Playwright-ghost ne fournit pas Playwright, vous devez aussi l'ajouter dans vos
dépendances.

```JSON
{
  "dependencies": {
    "playwright": "1.40.1",
    "playwright-ghost": "0.5.1"
  }
}
```

## Utilisation

```JavaScript
import { chromium } from "playwright-ghost";

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.goto("https://perdu.com/");
const where = await page.locator("pre").textContent();
console.log(where);

await context.close();
await browser.close();
```

## Plugins

💼 : Activé par défaut.\
⚙️ : Possède des options.

<table>
  <tr><th>Nom</th><th>Description</th><th></th></tr>
  <tr>
    <td><code>"polyfill/common"</code></td>
    <td>
      Corriger de nombreuses différences dans les APIs Javascript avec le
      nouveau headless de Chromium. Par exemple :
      <code>navigator.mimeTypes</code>...
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"polyfill/screen"</code></td>
    <td>
      Définir une valeur réaliste pour la taille de l'écran : 1920x1080. Ces
      valeurs sont configurables avec les options <code>width</code> et
      <code>height</code>.
    </td>
    <td>💼 ⚙️</td>
  </tr>
  <tr>
    <td><code>"polyfill/useragent"</code></td>
    <td>
      Changer
      l'<a href="https://developer.mozilla.org/docs/Glossary/User_agent">agent
      utilisateur</a> (<em>user agent</em>) du navigateur avec l'option
      <code>userAgent</code>.
    </td>
    <td>⚙️</td>
  </tr>
  <tr>
    <td><code>"polyfill/viewport"</code></td>
    <td>
      Faire varier la taille du navigateur. Par défaut les valeurs sont prises
      aléatoirement entre 1000x500 et 1800x800. Elles sont configurable avec les
      options <code>width</code> et <code>height</code>.
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
    <td><code>"polyfill/webgl"</code></td>
    <td>
      Modifier les valeurs des paramètres <em>WebGL</em>.
    </td>
    <td>💼</td>
  </tr>
  <tr>
    <td><code>"humanize/dialog"</code></td>
    <td>
      Fermer les boîtes de dialogues dans un temps humainement possible (entre
      1 et 5 secondes), car par défaut Playwright
      <a href="https://playwright.dev/docs/dialogs">les ferme immédiatement</a>.
      Les options <code>min</code> et <code>max</code> permettent de définir
      d'autres bornes pour le délais de fermeture.
    </td>
    <td>💼 ⚙️</td>
  </tr>
  <tr>
    <td><code>"util/debug"</code></td>
    <td>
      Afficher dans la console du programme, les messages affichés dans la
      console du navigateur.
    </td>
    <td></td>
  </tr>
  <tr>
    <td><code>"util/locale"</code></td>
    <td>
      Utiliser le navigateur installé localement.
    </td>
    <td></td>
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
