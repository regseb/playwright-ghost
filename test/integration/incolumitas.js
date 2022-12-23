import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, firefox } from "../../src/index.js";

/* eslint-disable */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * This is obviously not the best approach to 
 * solve the bot challenge. Here comes your creativity.
 * 
 * @param {*} page 
 */
async function solveChallenge(page) {
  // wait for form to appear on page
  await page.waitForSelector('#formStuff');
  // overwrite the existing text by selecting it
  // with the mouse with a triple click
  const userNameInput = await page.$('[name="userName"]');
  await userNameInput.click({ clickCount: 3 })
  await userNameInput.type("bot3000");
  // same stuff here
  const emailInput = await page.$('[name="eMail"]');
  await emailInput.click({ clickCount: 3 })
  await emailInput.type("bot3000@gmail.com");
  await page.selectOption('[name="cookies"]', 'I want all the Cookies');
  await page.click('#smolCat');
  await page.click('#bigCat');
  // submit the form
  await page.click('#submit');

  // handle the dialog
  page.on('dialog', async dialog => {
    // console.log(dialog.message());
    await dialog.accept();
  });

  // wait for results to appear
  await page.waitForSelector('#tableStuff tbody tr .url');
  // just in case
  await sleep(100);

  // now update both prices
  // by clicking on the "Update Price" button
  await page.waitForSelector('#updatePrice0');
  await page.click('#updatePrice0');
  await page.waitForFunction('!!document.getElementById("price0").getAttribute("data-last-update")');

  await page.waitForSelector('#updatePrice1');
  await page.click('#updatePrice1');
  await page.waitForFunction('!!document.getElementById("price1").getAttribute("data-last-update")');

  // now scrape the response
  let data = await page.evaluate(function () {
    let results = [];
    document.querySelectorAll('#tableStuff tbody tr').forEach((row) => {
      results.push({
        name: row.querySelector('.name').innerText,
        price: row.querySelector('.price').innerText,
        url: row.querySelector('.url').innerText,
      })
    })
    return results;
  })

  // console.log(data)
}

/* eslint-enable */

describe("Headless Chrome Detection Tests (incolumitas)", function () {
    describe("chromium", function () {
        it("should not failed", async function () {
            const browser = await chromium.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://bot.incolumitas.com/");
                await solveChallenge(page);
                await page.waitForTimeout(6000);

                const results = {
                    // eslint-disable-next-line unicorn/no-keyword-prefix
                    newTests: JSON.parse(await page.textContent("#new-tests")),
                    ...JSON.parse(await page.textContent("#detection-tests")),
                };

                for (const [test, values] of Object.entries(results)) {
                    for (const [name, value] of Object.entries(values)) {
                        if ("newTests" === test &&
                                "behavioralClassificationScore" === name) {
                            assert.ok(0.7 <= value,
                                      `${test}/${name}: ${value}`);
                        } else {
                            assert.ok("OK" === value || "UNKNOWN" === value,
                                      `${test}/${name}: ${value}`);
                        }
                    }
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/incolumitas-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/incolumitas-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });

    describe("firefox", function () {
        it("should not failed", async function () {
            const browser = await firefox.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://bot.incolumitas.com/");
                await solveChallenge(page);
                await page.waitForTimeout(6000);

                const results = {
                    // eslint-disable-next-line unicorn/no-keyword-prefix
                    newTests: JSON.parse(await page.textContent("#new-tests")),
                    ...JSON.parse(await page.textContent("#detection-tests")),
                };

                for (const [test, values] of Object.entries(results)) {
                    for (const [name, value] of Object.entries(values)) {
                        // Ignorer le test "intoli/webDriverAdvanced" qui
                        // remonte un faux-positif sous Firefox.
                        if ("intoli" === test && "webDriverAdvanced" === name) {
                            continue;
                        }

                        if ("newTests" === test &&
                                "behavioralClassificationScore" === name) {
                            assert.ok(0.7 <= value,
                                      `${test}/${name}: ${value}`);
                        } else {
                            assert.ok("OK" === value || "UNKNOWN" === value,
                                      `${test}/${name}: ${value}`);
                        }
                    }
                }
            } catch (err) {
                await page.screenshot({
                    path:     "./log/incolumitas-fx.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/incolumitas-fx.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});
