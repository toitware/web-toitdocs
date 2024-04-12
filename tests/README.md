# Tests

Some non-automated tests.

Things to check:
- make sure all links work.

Create the json and then view it with the Toitdoc viewer.

## Creating the JSON

```bash
/opt/toit-sdk/bin/toit.lsp toitdoc \
    --toitc /opt/toit-sdk/bin/toit.compile \
    --sdk /opt/toit-sdk \
    --out ../../public/sdk/latest.json \
    --exclude-sdk \
    --pkg-name "pkg" \
    --version "v0.0.1" \
    ./src
```
