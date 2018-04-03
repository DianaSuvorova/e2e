## Hello!

This project demonstrates how to set up e2e integration test for `react-create-app` with `puppeteer` and `enzyme`.

## Problem:
Setting up and writing integration tests should be easier. As easy as unit test.

By integration I mean testing end to end user flow by clicking through a real app rendered in a real browser hitting real backend.
One of the most popular tools for this purpose is `selenium`.

In selenium tests DOM elements normally get looked up on the page with css selectors or by x-path. And this is the tricky part - it is error-prone (the DOM structure changes a often) and with the javascript inline styles there is no real need to add classes or ids except for purpose of testing.

Also with React Apps DOM elements is no longer the right level of abstraction. Ideally one should be able to get an access to a React element on the page and within it grab underlying DOM elements to trigger events and assert values.

`Enzyme` has a great api for testing React apps. But major purpose of `enzyme` is unit tests. Normally `enzyme` tests are used with simulated DOM (jsdom). and is aiming to test local functionality.

Now the missing piece is how to set up an integration test in a real browser with enzyme. And this is what this project is demonstrates.

I choose to use `puppeteer` instead of `selenium`. But similar set up can be done with selenium if you need to cover more than just chrome browser.

## Example

An example of e2e test you can see in [src/e2e.test.js]('./src/e2e.test.js')

```js
test('can access enzyme el for e2e tests', async () => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  await page.goto('http://localhost:3000', {waitUntil: 'networkidle2'});

  const appName = await page.evaluate(() => {
    app = window.el.findWhere(c => c.name() === 'App');
    return app.name();
  });
  expect(appName).toEqual('App');
  await browser.close();
});
```

One great thing about it is an enzyme wrapper. So in order to find the element to be tested one can use enzyme API and don't need any css or x-path lookups or data-test-id.


## Execution
To run the test have `npm start` running and run `npm test`. It will run both unit tests (traditional jsdom) and integration tests using puppeteer.

## Set Up

The only change compared to vanilla create-react-app is in [src/index.js]('./src/index.js')


```js
if (process.env.REACT_APP_IS_E2E_TEST) {
  const el = Enzyme.mount(<App />, { attachTo: document.getElementById('root') });
  window.el = el;
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
```

where the App element gets wrapped into enzyme element which in turn get rendered to the DOM.
This is equivalent to rendering App directly with ReactDOM since that what enzyme internally does anyway after wrapping it into its testing API layer.
There might be some performance losses but it is way worth the convenience of local integration e2e test.

Corresponding change to  `start` script [package.json]('./package.js')

```json
    "start": "REACT_APP_IS_E2E_TEST=true react-scripts start",
```

## Running tests with Travis

To run integration with Travis I have added [scripts/e2e.js]('./scripts/e2e.js'). The script first launch compilation and starts server on first available port (`npm start`), and then launches tests.

Thus one can run integration tests on any PR which is not possible with saucelabs at the moment without compromising saucelabs login credentials. 
