# Changelog

## [0.17.0](https://github.com/regseb/playwright-ghost/compare/v0.16.0...v0.17.0) (2026-01-09)

### Features

- Add support to BrowserType.connect and BrowserType.connectOverCDP.
  ([480b31c](https://github.com/regseb/playwright-ghost/commit/480b31c1c1cadcf801df7a935e170d401231d999))
- Add support to BrowserType.launchServer.
  ([95810a1](https://github.com/regseb/playwright-ghost/commit/95810a1a05ad827a3a0bc6ea10eb28e436e5ee73))
- Support "steps" in plugin humanize.cursor.
  ([1d038fe](https://github.com/regseb/playwright-ghost/commit/1d038fe232f4aafc29e52e1a95a323108f1b71c7))
- Support Bun.
  ([8ab2cc9](https://github.com/regseb/playwright-ghost/commit/8ab2cc9ccb8ccb18173486dfa0ed4d87f1a650a6))

### Bug Fixes

- Do not re-export types that no longer exist.
  ([cff3293](https://github.com/regseb/playwright-ghost/commit/cff3293878a401ccd58454286c7ceea9adfbf475))
- **plugin/adblocker:** Wait blocking enable.
  ([dcc4e2c](https://github.com/regseb/playwright-ghost/commit/dcc4e2c2c98b6508a8df7278b71eaec9f300577b))
- **plugin/humanize/cursor:** Fix negative delay.
  ([cf23a2c](https://github.com/regseb/playwright-ghost/commit/cf23a2cf96aa4ed4fe5c67ecce1ff546cb1066e0))
- **plugin/sniffer:** Bypass CSP and optimize.
  ([0f5766c](https://github.com/regseb/playwright-ghost/commit/0f5766c01095443cb7152a45d3a91771a110f5d2))
- **plugin/weston:** Kill weston when persistent context is closed.
  ([0f8496d](https://github.com/regseb/playwright-ghost/commit/0f8496dcf7c71fd92ad918789f7253373c7fb685))
- **plugin/xvfb:** Kill Xvfb when persistent context is closed.
  ([8fa48d9](https://github.com/regseb/playwright-ghost/commit/8fa48d99434c3c9ce68659ffda85b569707b46dc))
- Support click in plugin debug.cursor.
  ([37366ed](https://github.com/regseb/playwright-ghost/commit/37366edf20b840aa077277b69cebb0e68c45dd9c))

## [0.16.0](https://github.com/regseb/playwright-ghost/compare/v0.15.0...v0.16.0) (2025-11-16)

### Features

- Add plugin to run browser in weston (Wayland).
  ([4d2abe6](https://github.com/regseb/playwright-ghost/commit/4d2abe619ace3575906ff00d939017d3c2a30c1f))
- Add plugin to sniff JavaScript properties used.
  ([1c9f663](https://github.com/regseb/playwright-ghost/commit/1c9f663973f124f4261709f0dd9b2c5753d31835))
- Move debug plugin in debug group.
  ([8e94f85](https://github.com/regseb/playwright-ghost/commit/8e94f85449d5a1d469fe8fe915b90b9a5c98cf92))

## [0.15.0](https://github.com/regseb/playwright-ghost/compare/v0.14.2...v0.15.0) (2025-10-05)

### ⚠ BREAKING CHANGES

- Remove deprecated plugin export from `"playwright-ghost"`. Now plugins are
  only available from `"playwright-ghost/plugins"`:

  ```javascript
  import plugins from "playwright-ghost/plugins";
  ```

### Bug Fixes

- **plugin/userAgent:** Change user agent with Firefox.
  ([dfbfd5f](https://github.com/regseb/playwright-ghost/commit/dfbfd5f5990bdd500ae91dc9dbefae992ff85e1b))
- **plugin/xvfb:** Support Chromium 140 (with use Wayland).
  ([4c8d50b](https://github.com/regseb/playwright-ghost/commit/4c8d50b29be6ec08926d7e3d7066ca53e11e442d))
- Remove deprecated plugins.
  ([0d12cff](https://github.com/regseb/playwright-ghost/commit/0d12cff41fdd5e5402e1cbf2c549310b909a4b4c))

## [0.14.2](https://github.com/regseb/playwright-ghost/compare/v0.14.1...v0.14.2) (2025-08-02)

### Bug Fixes

- Fix plugin utils.xvfb.
  ([9ec63c8](https://github.com/regseb/playwright-ghost/commit/9ec63c85a9a5af0cb036f409f976c668ffec5455))
- Re-export Playwright types.
  ([3fa21f4](https://github.com/regseb/playwright-ghost/commit/3fa21f4983f325aa127864844dbb55a332a39a79))

## [0.14.1](https://github.com/regseb/playwright-ghost/compare/v0.14.0...v0.14.1) (2025-07-30)

### Bug Fixes

- Use caret range for JSR.
  ([51936a0](https://github.com/regseb/playwright-ghost/commit/51936a00ba81ccb399c355811ab5239696e0799c))

## [0.14.0](https://github.com/regseb/playwright-ghost/compare/v0.13.0...v0.14.0) (2025-07-30)

### ⚠ BREAKING CHANGES

Plugin import has changed:

- before `<=0.13.0`:

  ```javascript
  import { plugins } from "playwright-ghost";
  ```

- after `>=0.14.0`:

  ```javascript
  import plugins from "playwright-ghost/plugins";
  ```

npm dependencies of plugins
([`utils.adblocker`](docs/plugins/utils/adblocker.md) and
[`utils.fingerprint`](docs/plugins/utils/fingerprint.md)) are now integrated
into Playwright-ghost. You no longer need to add them
([`@ghostery/adblocker-playwright`](https://www.npmjs.com/package/@ghostery/adblocker-playwright),
[`fingerprint-generator`](https://www.npmjs.com/package/fingerprint-generator)
or [`fingerprint-injector`](https://www.npmjs.com/package/fingerprint-injector))
to your dependencies.

You can now import just one plugin. For example, with
[`utils.camoufox`](docs/plugins/utils/camoufox.md):

```javascript
import { chromium } from "playwright-ghost";
import camoufoxPlugin from "playwright-ghost/plugins/utils/camoufox";

const browser = await chromium.launch({
  plugins: [camoufoxPlugin()],
});
// ...
```

### Features

- Add a plugin for Camoufox.
  ([1777fc3](https://github.com/regseb/playwright-ghost/commit/1777fc3572bce176cb40cdb5cf4ed30d4676edd1))
- Optimize plugins.
  ([#20](https://github.com/regseb/playwright-ghost/issues/20))
  ([0f2ce8c](https://github.com/regseb/playwright-ghost/commit/0f2ce8ca577a43e7cc1b1984b668d585122e3beb))
- **plugin/debug:** Show cursor.
  ([f008a8f](https://github.com/regseb/playwright-ghost/commit/f008a8f92d9ba61e825866b919d09129e3fde5ca))

### Bug Fixes

- **plugin/xvfb:** Support Explicit Resource Management.
  ([16a6259](https://github.com/regseb/playwright-ghost/commit/16a6259d6e377297279f80abb2e60f704c0602d3))

## [0.13.0](https://github.com/regseb/playwright-ghost/compare/v0.12.0...v0.13.0) (2025-04-27)

### Features

- Can disable plugins recommended.
  ([329b1b0](https://github.com/regseb/playwright-ghost/commit/329b1b096a8ba3637a256b66b5b971e39d866c2d))
- **plugin/cursor:** Starts at a random position.
  ([f8b9c78](https://github.com/regseb/playwright-ghost/commit/f8b9c785e0fe314910802e9be90cc17a6a70128b))

### Bug Fixes

- **plugin/click:** Hook Mouse functions.
  ([fba09f9](https://github.com/regseb/playwright-ghost/commit/fba09f9ab1c2d6ea666f5e4cfc5141ee166299b2))

## [0.12.0](https://github.com/regseb/playwright-ghost/compare/v0.11.0...v0.12.0) (2025-03-28)

### Features

- Add plugin to fingerprint.
  ([0484e2f](https://github.com/regseb/playwright-ghost/commit/0484e2fef20639e52bd3bb58ac2fec5c485ae904))
- **plugin/cursor:** Click in the element's ellipse.
  ([284e7d7](https://github.com/regseb/playwright-ghost/commit/284e7d7430fa891d4ccc59361cdaeb51007d0353))
- Support hook on Frame.
  ([3a5e13e](https://github.com/regseb/playwright-ghost/commit/3a5e13e41714be5941613d082dc7ce9a1022f6ed))

## [0.11.0](https://github.com/regseb/playwright-ghost/compare/v0.10.0...v0.11.0) (2025-03-05)

### Features

- Enable deactivation of recommended plugins.
  ([8fb6f0d](https://github.com/regseb/playwright-ghost/commit/8fb6f0d6c31e1f8ff5b691f06ff2441dd60242db))

### Bug Fixes

- **plugin/cursor:** Support click on inaccessible locator.
  ([0e5fed7](https://github.com/regseb/playwright-ghost/commit/0e5fed710c8c3c34ad1df0747e6814115feb3829))

## [0.10.0](https://github.com/regseb/playwright-ghost/compare/v0.9.0...v0.10.0) (2025-03-03)

### Features

- Add a cursor plugin (with ghost-cursor).
  ([5ac413b](https://github.com/regseb/playwright-ghost/commit/5ac413b19ed75d88073de231dce8ea6903949431))
- Add patchright support.
  ([844bee2](https://github.com/regseb/playwright-ghost/commit/844bee21e99456b36f054192303135ef9c971353))
- Add plugin to humanize click.
  ([6c68e92](https://github.com/regseb/playwright-ghost/commit/6c68e920412df9659b10816ab033b240776b20b5))
- Add plugin to Xvfb.
  ([d8f8789](https://github.com/regseb/playwright-ghost/commit/d8f8789cc21d3bc0909edfd27d75580dfe977387))
- **plugin/utils.locales:** Be able to specify the browser name.
  ([8f6bee4](https://github.com/regseb/playwright-ghost/commit/8f6bee4e316d5aa6fc65d15d43bbf355a643523a))

### Bug Fixes

- **plugin/dialog:** Rename option timeout to delay.
  ([4a9ffd8](https://github.com/regseb/playwright-ghost/commit/4a9ffd8c9662e6ebdfc03d4446820e14f398feda))
- **plugin/polyfill.headless:** Support new headless in Playwright 1.29.
  ([97e885e](https://github.com/regseb/playwright-ghost/commit/97e885ebcb43052dac66f99fecae766720ed842a))

## [0.9.0](https://github.com/regseb/playwright-ghost/compare/v0.8.0...v0.9.0) (2024-10-30)

### Features

- Migrate adblocker to Ghostery.
  ([5602d31](https://github.com/regseb/playwright-ghost/commit/5602d317a80534e6941a73bcd085724134e7115e))

### Bug Fixes

- Remove 's' of 'recommended' list plugins.
  ([ff8199c](https://github.com/regseb/playwright-ghost/commit/ff8199c37681b5f36e547dc47ed3ac97b0ca962e))
- Standardize random options.
  ([a292d25](https://github.com/regseb/playwright-ghost/commit/a292d2577d4fec6fdef4d38f8649c7775e82e9ea))

## [0.8.0](https://github.com/regseb/playwright-ghost/compare/v0.7.2...v0.8.0) (2024-10-09)

### Features

- Ajouter le support de rebrowser.
  ([050aad5](https://github.com/regseb/playwright-ghost/commit/050aad5229707ec936330d4de009b68ff69315ab))
- Supporter les plugins asynchrones.
  ([ca3799b](https://github.com/regseb/playwright-ghost/commit/ca3799b771d62623d083bed2328a6eabc1edf9d3))

## [0.7.2](https://github.com/regseb/playwright-ghost/compare/v0.7.1...v0.7.2) (2024-08-07)

### Bug Fixes

- Corriger la publication.
  ([bf993d0](https://github.com/regseb/playwright-ghost/commit/bf993d011531b9bbdd4c2e2c6cbd4dc316e9e10e))

## [0.7.1](https://github.com/regseb/playwright-ghost/compare/v0.7.0...v0.7.1) (2024-08-07)

### Bug Fixes

- Améliorer la documentation.
  ([f32671b](https://github.com/regseb/playwright-ghost/commit/f32671b625ed59c0d00d2079fb6f7bdc5b61a091))

## [0.7.0](https://github.com/regseb/playwright-ghost/compare/v0.6.0...v0.7.0) (2024-05-09)

### Features

- Ajouter un plugin pour "enable-automation".
  ([afa5c76](https://github.com/regseb/playwright-ghost/commit/afa5c761afbd7fca5e6201a7a84ef7bff68f13fe))

### Bug Fixes

- Réduire le nom des plugins.
  ([47fb196](https://github.com/regseb/playwright-ghost/commit/47fb19657215e9cb777807ef1d3e5d1f009b216e))

## [0.6.0](https://github.com/regseb/playwright-ghost/compare/v0.5.1...v0.6.0) (2024-02-12)

### Features

- Simplifier les plugins.
  ([f5b740f](https://github.com/regseb/playwright-ghost/commit/f5b740f69223b76eccd49447819c3eee376e5213))

## [0.5.1](https://github.com/regseb/playwright-ghost/compare/v0.5.0...v0.5.1) (2024-01-14)

### Bug Fixes

- Formater les fichiers modifiés par la release.
  ([8682535](https://github.com/regseb/playwright-ghost/commit/868253591253a5155cf79f3f331f8d3cc2041032))

## [0.5.0](https://github.com/regseb/playwright-ghost/compare/v0.4.0...v0.5.0) (2023-12-15)

### Features

- Améliorer la documentation du README.
  ([d53b13a](https://github.com/regseb/playwright-ghost/commit/d53b13a2be129fa7a00890653e7134eea67cda39))

## [0.4.0](https://github.com/regseb/playwright-ghost/compare/v0.3.9...v0.4.0) (2023-10-18)

### Features

- Ajouter un plugin pour le "screen".
  ([7a443a2](https://github.com/regseb/playwright-ghost/commit/7a443a21467720ccf779ea8bb33a2cab547964a3))
- Ajouter un plugin pour l'agent utilisateur.
  ([561b7aa](https://github.com/regseb/playwright-ghost/commit/561b7aa12ceed8fe52920b6bb75d5b2ec133f8e3))

### Bug Fixes

- Corriger la modification du viewport.
  ([c5cfa12](https://github.com/regseb/playwright-ghost/commit/c5cfa12b0b6ae9a8ed9631d4e783112d57dc5b4a))
- Enlever le plugin abBlock.
  ([ece8bce](https://github.com/regseb/playwright-ghost/commit/ece8bcef928c435eb5556ccda04ac85034ee8382))
- Enlever le plugin isHeadless.
  ([90a4a9f](https://github.com/regseb/playwright-ghost/commit/90a4a9f10b8a33ee10705d86a9caf07ff03386bb))
