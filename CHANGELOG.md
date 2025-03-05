# Changelog

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

- Remove 's' of 'recommendeds' list plugins.
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
- Ajouter un plugin pour le user agent.
  ([561b7aa](https://github.com/regseb/playwright-ghost/commit/561b7aa12ceed8fe52920b6bb75d5b2ec133f8e3))

### Bug Fixes

- Corriger la modification du viewport.
  ([c5cfa12](https://github.com/regseb/playwright-ghost/commit/c5cfa12b0b6ae9a8ed9631d4e783112d57dc5b4a))
- Enlever le plugin abBlock.
  ([ece8bce](https://github.com/regseb/playwright-ghost/commit/ece8bcef928c435eb5556ccda04ac85034ee8382))
- Enlever le plugin isHeadless.
  ([90a4a9f](https://github.com/regseb/playwright-ghost/commit/90a4a9f10b8a33ee10705d86a9caf07ff03386bb))
