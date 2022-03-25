# Bigtincan Web App Style Guide
Design, build and showcase components.

## Setup
We have migrated from `npm` to `yarn` for dependency management. See the [docs](https://yarnpkg.com/lang/en/docs/migrating-from-npm/) for more details.

    yarn install

## Development
Runs `webpack-dev-server` with hot module reloading.

    yarn run dev
    yarn run devs  # https

## Build
Generates a `index.html` file with hashed file names to **/build**.

    yarn run build

## Testing
Execute unit tests.

    yarn run test

Quick-run build.

    static -p 3333 -a 0.0.0.0 build/
    anywhere -d build/ -h 0.0.0.0 -f /index.html -p 3333 -s

## Managing Dependencies
Dependencies are listed in `package.json`.

`dependencies` are required to build (`yarn run build`).

`devDependencies` are required during development (linters, test tools, task runners).

Install as follows:

    yarn add package-name
    yarn add package-name --dev

You must run `yarn install` to update dependencies if someone else has added or updated a dependency.

## Loading resources
Due to issues with code splitting in webpack (to be confirmed in webpack 2), please manage your imports as follows:

    // Wrong way
    import { Loader } from ‘components’;

    // Right way
    import Loader from 'components/Loader/Loader';

## Naming event handlers
Any event handler props are to be named: `on[Target]EventNameAction`.

Handler functions are to be named: `handle[Target]EventNameAction`.

  - `propName => handlerName`
  - `onKeyUp => handleKeyUp `
  - `onItemClick => handleItemClick`
  - `onFullScreenExit => handleFullScreenExit`

## Icons
Place new vectors in `assets/btc-font/vectors`.

    grunt icons

Single colour icons are converted to an icon font, `btc-font` in style-guide. Icons that require multiple colours are available via `<SVGIcon/>`.

### Adding new icons
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


## Browser Support
Minimum desktop browser support is defined in `browserlist`.

  - Chrome 44
  - Firefox 31
  - Safari 9
  - IE 11

## Contributing
All editable files are located inside **src**.

## Useful links
  - [Internal URL](http://styleguide.bigtincan.org/)
  - [Documentation](https://bigtincan.atlassian.net/wiki/display/TES/Web+App+Topic)
  - [JIRA Dashboard](https://bigtincan.atlassian.net)
  - [ES6 Overview in 350 Bullet Points](https://ponyfoo.com/articles/es6)
  - [React Docs](https://facebook.github.io/react/docs/getting-started.html)
  - [Redux Docs](http://redux.js.org/)
