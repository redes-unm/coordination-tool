# CellWatch Community Coordination Tool

A web-based tool for community network measurement coordination.

## Development setup

1. Install Node.js and the npm package manager: <https://docs.npmjs.com/downloading-and-installing-node-js-and-npm>.
2. From within the project directory, run `npm install`.
3. Run `npm run dev` to start the local development server; make sure it loads at <http://localhost:3000>.

## Testing

We currently have [Playwright](https://playwright.dev) setup for testing. It runs end-to-end tests in a real browser.

The first time you run tests, you'll need to have Playwright install the browsers it needs; to do so, run `npm exec playwright install chromium firefox`.

To run the tests, use `npm run test`. This command will build and run the coordination tool (unless something is already running on `localhost:3000`) and then run the tests. If you're doing lots of test runs, you can speed things up by leaving the coordination tool running in one terminal (`npm run build && npm run start` or `npm run dev`) and running tests from another.
