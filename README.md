# Setup for development

This project takes the generated JSON language description and builds the
documentation for it.

This project is a [Create React App](https://create-react-app.dev) project.

To be able to build/run the project locally, get the `latest.json` from [toitdocs.infra.toit.io](https://toitdocs.infra.toit.io/sdk/latest.json) and put it in `public/sdk/`.

## Node version

This project doesn't compile anymore with recent node versions. Use,
for example, `nvm` to install an older version of node. The repository
contains a `.nvmrc` file that specifies the node version that works.

If you have nvm installed, but not automatically activated in your
.bashrc, you will need to do

```bash
source /usr/share/nvm/init-nvm.sh
```

Then run `nvm install` to install the correct version of node.

## yarn

`yarn` is used in web projects. To install `yarn`, follow the guide [here](https://yarnpkg.com/lang/en/docs/install/#debian-stable).

Note! You don't need to setup your `PATH` env.var. as described in the guide.

If you haven't installed `node` yet, install `node` from [nodejs.org](https://nodejs.org/en/). Add the node bin directory to your `PATH` in `$HOME/.profile`

The version of `node` must be >= v12.16.1, but see above for how to use
nvm to get the right version.

## Dependency security updates

The Yarn resolutions in `package.json` upgrade `@svgr/webpack` to v6 so that
`react-scripts` uses SVGO v2 instead of the vulnerable v1 dependency. SVGR v6
supports the Webpack 5 and file-loader setup used here. The `qs` resolution
selects the patched v6 release for consumers that still constrain older v6
minor versions, including Express, body-parser, and Cypress's request library.
Recheck these overrides when upgrading `react-scripts` or Cypress.

Keep the v3 and v4 entries for `js-yaml`, and the v6 and v7 entries for
`postcss-selector-parser`, updated separately in `yarn.lock`; their consumers
require different major versions.

## Linting and imports in VS Code

- Add the ESLint extension to VS Code to get linting directly in the code. https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint.
- To get the right indentation, etc. directly in the code, and on save add the Prettier extension to VS Code. https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode.
- To get VS Code to automatically fix linting errors (if possible) and organize imports on save, add the following to your settings.json file:

        "editor.codeActionsOnSave": [
          "source.organizeImports",
          "source.fixAll.eslint"
        ],

## Useful developer tools

- [React developer tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux developer tools for Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?Itemid=1027)

# Development

## Available yarn scripts

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## JSON files

The page loads the toitdoc information from `public/toitdoc.json`.

You can create new json files by running the following command:

### Core libraries

```bash
toit doc build --sdk --output "$OUTFILE"
```

### Package

```bash
toit doc build --package --output "$OUTFILE" $PATH_TO_PACKAGE
```

You might want to exclude the sdk and/or packages from the generated documentation:

```bash
toit doc build --package --exclude-sdk --output "$OUTFILE" $PATH_TO_PACKAGE
toit doc build --package --exclude-pkgs --output "$OUTFILE" $PATH_TO_PACKAGE
```

### Folder

You can also just build the toitdoc of a folder:

```bash
toit doc build --output "$OUTFILE" $PATH_TO_FOLDER
```

## Cloudflare

As of 2026-02-15, we are using Cloudflare Pages to deploy the documentation.

We can't use GitHub pages, because we need to have `_redirects` so that Google
can properly index the documentation.

The documentation is deployed to `libs.toit.io` and `libs-dev.toit.io`.


## Static documentation and indexing

`yarn build` produces the portable JavaScript viewer, as before. For a specific
documentation dataset, follow it with:

```sh
yarn prerender build https://libs.toit.io/
```

This reads `build/toitdoc.json` and renders the existing React components into
one HTML file per library and class. The pages contain documentation, code,
navigation, styles, distinct titles, and absolute canonical links before
JavaScript runs. The viewer becomes interactive after its data loads; if that
fetch fails, the static documentation remains readable.

The static build also creates `sitemap.xml`, adds it to `robots.txt`, and replaces
the blanket SPA rewrite in `_redirects` with explicit 301 redirects for merged
directory/module aliases (`foo/foo` to `foo`). A real same-name child library is
kept separate. Legacy SDK URLs under `/toit/lib/` redirect when the corresponding
current page exists. `404.html` disables Cloudflare Pages' default SPA fallback, so
unknown URLs return HTTP 404. The live viewer marks missing pages `noindex` and
explains when private class documentation is omitted. References to omitted
private classes are rendered as text; builds that include those classes retain
their links.

Always start from a fresh `yarn build` when prerendering. The canonical base URL
identifies the preferred public deployment, including any package/version prefix.
For example:

```sh
yarn prerender build https://pkg.toit.io/github.com/example/package@1.0.0/docs/
```

For that example, serve the output directory at the specified `/.../docs/` prefix.
The hosting server must serve matching `.html` files, honor the generated
redirects, and return `404.html` with status 404 for missing routes. The current
package server needs that integration before it can use static output; the
portable viewer alone still depends on its server for HTTP status codes.

CI preserves the portable viewer in the existing `build`/release artifacts for
package hosting and `toit doc serve`. It uploads the prerendered SDK separately
as `static-site` and deploys that to Cloudflare Pages. Both `libs-dev.toit.io`
and production use `libs.toit.io` canonical URLs.

Run `yarn test --watchAll=false --runInBand` for static-rendering regressions and
`yarn test:ci` for browser tests. No browser process is needed to prerender pages.
