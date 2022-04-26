https://playwright.dev/
https://pptr.dev/

https://github.com/berstend/puppeteer-extra
https://github.com/ulixee/secret-agent
https://github.com/kkoooqq/fakebrowser

https://fingerprintjs.com/products/bot-detection/
https://github.com/ulixee/double-agent
https://abrahamjuliot.github.io/creepjs/
https://fingerprintjs.github.io/fingerprintjs/
https://pixelscan.net/
https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.html
https://amiunique.org/fp
https://niespodd.github.io/browser-fingerprinting
https://coveryourtracks.eff.org/
http://f.vision/
https://antcpt.com/eng/information/demo-form/recaptcha-3-test-score.html
Si "Spoofed" apparait dans la page : https://www.deviceinfo.me/
https://portswigger-labs.net/hackability/
https://bot.sannysoft.com/
https://bot.incolumitas.com/
https://antoinevastel.com/bots
https://arh.antoinevastel.com/bots/areyouheadless
https://plaperdr.github.io/morellian-canvas/Prototype/webpage/picassauth.html
https://vytal.io/
https://infosimples.github.io/detect-headless/


## Différences

### Plugin / MimeType

<table>
  <tr>
    <th></th>
    <th>Firefox</th>
    <th>Firefox headfull with playwright</th>
    <th>Firefox headless with playwright</th>
  </tr>
  <tr>
    <td>
      <code>Object.getOwnPropertyDescriptor(Plugin.prototype, "version")</code>
    </td>
    <td><code>undefined</code></td>
    <td colspan="2">
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
    <td colspan="2"><code>0</code></td>
  </tr>
  <tr>
    <td><code>navigator.mimeTypes.length</code></td>
    <td><code>2</code></td>
    <td colspan="2"><code>0</code></td>
  </tr>
</table>
