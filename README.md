# Bigtincan Hub Web App v5

## About
Repository for Hub Web App v5. Requires Node.js v5+ to build. Written in ES6 and transpiled to ES5 using Babel. React is used for views and Redux for state management.

### Main branches
The following branches are built and deployed automatically. Check `#jenkins` in Slack for build status.

  - [`develop`](https://appnext.bigtincan.org) - integration branch - contains latest features for upcoming releases
  - [`preview`](https://appnext.bigtincan.info) - production-ready - pending approval by testers
  - [`master`](https://appnext.bigtincan.com) - production-ready - approved by testers

See [BRANCHES.md](BRANCHES.md) for an explanation.

## Install & update dependencies
Make sure you are running the latest version of Node.js, `npm` and `yarn`.

    yarn install --ignore-scripts

## Development
Runs webpack-dev-server on port 3000 with hot module reloading.

    npm run dev   # http
    npm run devs  # https

## Building
Outputs to **/build**, ready to be served in production.

    npm run build

## Testing
Execute unit tests.

    npm run test

Quick-run build: https://www.npmjs.com/package/anywhere

    mv build/config.js.example build/config.js
    anywhere -d build/ -h 0.0.0.0 -f /index.html -p 3000 -s

## Lint
Validates code, uses eslint-config-airbnb as a base.

    npm run lint

## Notes

### Browser Support
Minimum desktop browser support is defined in `browserlist`.

  - Chrome 39
  - Firefox 28
  - Safari 8
  - IE 10

### Loading resources

    // WRONG WAY - Issues with code splitting
    import { Loader } from ‘components’;

    // CORRECT WAY - This way works with code splitting (required in prod)
    import Loader from 'components/Loader/Loader';

### Naming event handlers
Any event handler props are to be named: `on[Target]EventNameAction`, e.g. `onKeyUp, onItemClick, onFullScreenExit`.

Handler functions are to be named: `handle[Target]EventNameAction`, e.g. `handleKeyUp, handleItemClick, handleFullScreenExit`.

### Mananging Translations
A typical workflow to update English translation strings to OneSky is as follows:

    npm run extract:messages
    npm run manage:translations
    grunt postEn

### Icons
Single colour icons are converted to an icon font, `btc-font` in style-guide. Icons that require multiple colours are available via the `SVGIcon` component.

To add a new icon to `btc-font`, export the SVG from Zeplin. Before conversion, we must normalise the icon dimensions.

Sketch files are available for each icon on the NAS at: `afp://sydnasprod01._afpovertcp._tcp.local/Transfer/Design/Web/v5/Icons`.

  1. Duplicate an existing Sketch file: `icon-{name}`.
  2. Clear contents.
  3. Add new SVG to the Sketch file, canvas dimensions are set to 512x512.
  4. Remove any unnecessary folder nesting created by Zeplin, set the fill colour to #000 and position to 0, 0.
  5. Resize the largest dimension to 512px and center the icon on the canvas.
  6. Fix the other dimension to a multiple of 16 (or 8).
  7. Export the icon as SVG and preview output.
  8. If everything looks good, add to `style-guide/assets/btc-font/vectors` and run `grunt icons` from style-guide.
  9. Check `style-guide/assets/btc-font/styleguide/btc-font-preview.html` and make sure the icon looks correct.
  10. For bonus points, every point in the vector should fall on a multiple of 16.

## Useful links
  - [Documentation](https://bigtincan.atlassian.net/wiki/display/TES/Web+App+Topic)
  - [JIRA Dashboard](https://bigtincan.atlassian.net)
  - [ES6 Overview in 350 Bullet Points](https://ponyfoo.com/articles/es6)
  - [React Docs](https://facebook.github.io/react/docs/getting-started.html)
  - [Redux Docs](http://redux.js.org/)
