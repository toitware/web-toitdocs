# Tests

Some non-automated tests.

For each test create the json and then view it with the Toitdoc viewer.

## Creating the JSON

```bash
~/code/opentoit/build/host/sdk/bin/toit.lsp toitdoc \
    --toitc ~/code/opentoit/build/host/sdk/bin/toit.compile \
    --sdk ~/code/opentoit/build/host/sdk \
    --out ../../public/sdk/latest.json \
    --exclude-sdk \
    --version "v0.0.1" \
    ./src
```

## Viewing the JSON

Make sure to replace the `index.html` with the `pkg.html`:

```bash
cp ../../public/pkg.html ../../public/index.html
```

Then run `yarn start` at the root of the project (as instructed in
the top-level README).
