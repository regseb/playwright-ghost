# Playwright-ghost

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" alt="">

[![npm][img-npm]][link-npm]
[![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]
[![semver][img-semver]][link-semver]

Playwright-ghost est une surcouche de [Playwright](https://playwright.dev/) en
lui ajoutant un système de plugins pour gommer les différences entre un
navigateur utilisé par un être humain et un navigateur
[_headless_](https://fr.wikipedia.org/wiki/Navigateur_headless) contrôlé par un
programme.

L'API de Playwright-ghost est identique à celle de Playwright, sauf l'ajout de
l'option `plugins` aux méthodes
[`browserType.launch([options])`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch)
et
[`browserType.launchPersistentContext(userDataDir, [options])`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context).

La propriété `plugins` est un tableau avec les plugins à ajouter.

## Installation

Playwright-ghost ne fournit pas Playwright, vous devez aussi l'ajouter dans vos
dépendances.

```shell
npm install playwright playwright-ghost
```

## Utilisation

Voici un exemple avec l'activation des plugins recommandés.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: plugins.recommendeds(),
});
const context = await browser.newContext();
const page = await context.newPage();

await page.goto("https://perdu.com/");
const where = await page.locator("pre").textContent();
console.log(where);

await context.close();
await browser.close();
```

Dans cet autre exemple, trois plugins sont ajoutés :

- `polyfill.headless` qui n'a pas d'options ;
- `polyfill.screen` en définissant d'autres valeurs pour la taille de l'écran ;
- `util.adBlocker` en utilisant les options par défaut.

```javascript
import { chromium, plugins } from "playwright-ghost";

const browser = await chromium.launch({
  plugins: [
    plugins.polyfill.headless(),
    plugins.polyfill.screen({ width: 1280, height: 720 }),
    plugins.util.adBlocker(),
  ],
});
// ...
```

## Plugins

⭐ : Plugin recommandé / ⚙️ : Possède des options / 📦 : Nécessite une
dépendance

<!-- markdownlint-disable no-inline-html-->
<table>
  <tr><th></th><th>Nom</th><th>Description</th></tr>
  <tr>
    <td>⭐</td>
    <td><code>polyfill.automation</code></td>
    <td>
      Désactiver la fonctionnalité <code>--enable-automation</code> dans
      Chromium.
    </td>
  </tr>
  <tr>
    <td>⭐</td>
    <td><code>polyfill.headless</code></td>
    <td>
      Corriger de nombreuses différences dans les APIs Javascript avec le
      nouveau mode <em>headless</em> de Chromium. Par exemple :
      <code>navigator.mimeTypes</code>...
    </td>
  </tr>
  <tr>
    <td>⭐ ⚙️</td>
    <td><code>polyfill.screen</code></td>
    <td>
      Définir une valeur réaliste pour la taille de l'écran : 1920x1080. Ces
      valeurs sont configurables avec les options <code>width</code> et
      <code>height</code>.
    </td>
  </tr>
  <tr>
    <td>⚙️</td>
    <td><code>polyfill.userAgent</code></td>
    <td>
      Changer
      l'<a href="https://developer.mozilla.org/docs/Glossary/User_agent">agent
      utilisateur</a> (<em>user agent</em>) du navigateur avec l'option
      <code>userAgent</code>.
    </td>
  </tr>
  <tr>
    <td>⭐ ⚙️</td>
    <td><code>polyfill.viewport</code></td>
    <td>
      Faire varier la taille du navigateur. Par défaut les valeurs sont prises
      aléatoirement entre 1000x500 et 1800x800. Elles sont configurables avec
      les options <code>width</code> et <code>height</code>.
    </td>
  </tr>
  <tr>
    <td>⭐</td>
    <td><code>polyfill.webdriver</code></td>
    <td>
      Passer à <code>false</code> la variable <code>navigator.webdriver</code>.
    </td>
  </tr>
  <tr>
    <td></td>
    <td><code>polyfill.webGL</code></td>
    <td>
      Modifier les valeurs des paramètres <em>WebGL</em>.
    </td>
  </tr>
  <tr>
    <td>⭐ ⚙️</td>
    <td><code>humanize.dialog</code></td>
    <td>
      Fermer les boîtes de dialogues dans un temps humainement possible (entre
      1 et 5 secondes), car par défaut Playwright
      <a href="https://playwright.dev/docs/dialogs">les ferme immédiatement</a>.
      Les options <code>min</code> et <code>max</code> permettent de définir
      d'autres bornes pour le délais de fermeture.
    </td>
  </tr>
  <tr>
    <td>⚙️ 📦</td>
    <td><code>util.adBlocker</code></td>
    <td>
      Ajouter le bloqueur de publicité
      <a href="https://github.com/ghostery/adblocker#readme">Cliqz'
      adblocker</a>. Vous devez ajouter
      <a href="https://www.npmjs.com/package/@cliqz/adblocker-playwright"
        ><code>@cliqz/adblocker-playwright</code></a>
      dans vos dépendances npm.
    </td>
  </tr>
  <tr>
    <td></td>
    <td><code>util.debug</code></td>
    <td>
      Afficher dans la console du programme, les messages affichés dans la
      console du navigateur.
    </td>
  </tr>
  <tr>
    <td></td>
    <td><code>util.locale</code></td>
    <td>
      Utiliser le navigateur installé localement.
    </td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html-->

## Anti-bot

|                                    | Chromium            | Firefox            |
| ---------------------------------- | ------------------- | ------------------ |
| BrowserScan                        | ❌ CDP              | ❌ WebDriver       |
| Chromedriver Detector              | ❌ devtools-console | ✅                 |
| CreepJS                            | ❌ F-               | ❌ D+              |
| Datadome                           | ✅                  | ✅                 |
| Device Info                        | ✅                  | ❌                 |
| FingerprintJS                      | ✅                  | ❌ Automation Tool |
| HeadlessDetectJS                   | ✅                  | ❌ 0.2             |
| infosimples                        | ✅                  | ❌ Webdriver       |
| Chrome Headless Detection (Intoli) | ✅                  | ❌ WebDriver       |
| nowsecure                          | ✅                  | ✅                 |
| Antibot (Sannysoft)                | ✅                  | ❌ Webdriver       |
| Cloudflare turnstile demo          | ❌                  | ❌                 |

[img-npm]: https://img.shields.io/npm/dm/playwright-ghost?label=npm&logo=npm&logoColor=whitesmoke
[img-build]: https://img.shields.io/github/actions/workflow/status/regseb/playwright-ghost/ci.yml?branch=main&logo=github&logoColor=whitesmoke
[img-coverage]: https://img.shields.io/endpoint?label=coverage&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fplaywright-ghost%2Fmain
[img-semver]: https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&logoColor=whitesmoke
[link-npm]: https://www.npmjs.com/package/playwright-ghost
[link-build]: https://github.com/regseb/playwright-ghost/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]: https://dashboard.stryker-mutator.io/reports/github.com/regseb/playwright-ghost/main
[link-semver]: https://semver.org/spec/v2.0.0.html "Semantic Versioning 2.0.0"
