# Slimformation - Chrome Extension

## Develop

** Setup Dependencies **

- `brew install node`, or go [here](http://nodejs.org/download/).
  - Installs `node` and `npm`
- `npm install` (be sure you're in this extension's directory)

** Install Components Using Bower **
- `bower install`
- Manage components in `component.json`

**  CoffeeScript Development **
- `grunt watch` with automatically compile `scripts/coffee/*` to `scripts/js/*`

** RequireJS Usage **
- An [example setup](http://requirejs.org/docs/start.html).
- Basically, use `components/requirejs/require.js` and load like normal. To include third party components, make sure you set either `data-root` in HTML or `baseUrl` in JavaScript to be the root of the entire app ('./').
- See the `mockup.html` view for an example setup.


