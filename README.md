# Setup for development

This project takes the generated JSON language description and builds the
documentation for it.

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
toit doc build --sdk --out "$OUTFILE"
```

### Package

```bash
toit doc build --package --out "$OUTFILE" $PATH_TO_PACKAGE
```

You might want to exclude the sdk and/or packages from the generated documentation:

```bash
toit doc build --package --exclude-sdk --out "$OUTFILE" $PATH_TO_PACKAGE
toit doc build --package --exclude-pkgs --out "$OUTFILE" $PATH_TO_PACKAGE
```

### Folder

You can also just build the toitdoc of a folder:

```bash
toit doc build --out "$OUTFILE" $PATH_TO_FOLDER
```
