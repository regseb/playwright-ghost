# Guillotine

## Differences

<table>
  <tr>
    <th rowspan="2"></th>
    <th colspan="2">Firefox</th>
  </tr>
  <tr>
    <th>headfull</th>
    <th>headless¹</th>
  </tr>
  <tr>
    <td>
      <code>Object.getOwnPropertyDescriptor(Plugin.prototype, "version")</code>
    </td>
    <td><code>undefined</code></td>
    <td>
      <pre><code>{
    get: version(),
    set: undefined,
    enumerable: true,
    configurable: true
}</code></pre>
    </td>
  </tr>
  <tr>
    <td><code>navigator.plugins.length</code></td>
    <td><code>5</code></td>
    <td><code>0</code></td>
  </tr>
  <tr>
    <td><code>navigator.mimeTypes.length</code></td>
    <td><code>2</code></td>
    <td><code>0</code></td>
  </tr>
  <tr>
    <td><code>navigator.pdfViewerEnabled</code></td>
    <td><code>true</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>SharedArrayBuffer</code></td>
    <td><code>ReferenceError: SharedArrayBuffer is not defined</code></td>
    <td><code>function SharedArrayBuffer()</code></td>
  </tr>
</table>

¹ Controlled with [Playwrigth](https://playwright.dev/).

## Others detectors

- [CreepJS](https://abrahamjuliot.github.io/creepjs/) by Abraham ;
- [Detect Headless](https://infosimples.github.io/detect-headless/) by
  Infosimples ;
- [BotD](https://fingerprintjs.com/products/bot-detection/) by FingerprintjS ;
- [Chrome Headless
   Detection](https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.html)
  by Intoli ;
- [Antibot](https://bot.sannysoft.com/) by SannySoft.
- [HeadlessDetectJS](https://github.com/LouisKlimek/HeadlessDetectJS) by
  LouisKlimek.
