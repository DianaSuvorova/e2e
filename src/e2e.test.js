import puppeteer from 'puppeteer';

const PORT = process.env.PORT || '3000'

test('can access enzyme el for e2e tests', async () => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  await page.goto(`http://localhost:${PORT}`, {waitUntil: 'networkidle2'});

  const appName = await page.evaluate(() => {
    app = window.el.findWhere(c => c.name() === 'App');
    return app.name();
  });
  expect(appName).toEqual('App');
  await browser.close();
});
