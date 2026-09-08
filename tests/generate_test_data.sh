#!/bin/bash

# Exit on error
set -e

# Go to the project root
cd "$(dirname "$0")/.."

# Install dependencies for the test package
echo "Installing dependencies for test-pkg..."
toit pkg install --project-root=tests/test-pkg

# Generate the toitdoc.json for the package (default for now)
echo "Generating public/toitdoc.json from test-pkg..."
toit doc build --package --output public/toitdoc.json tests/test-pkg

# Generate a separate package json for specific tests
echo "Generating public/toitdoc_pkg.json..."
toit doc build --package --output public/toitdoc_pkg.json tests/test-pkg

# Generate SDK documentation
echo "Generating public/toitdoc_sdk.json..."
toit doc build --sdk --output public/toitdoc_sdk.json

# Generate basic folder documentation
echo "Generating public/toitdoc_folder.json..."
toit doc build --output public/toitdoc_folder.json tests/test-pkg/src

echo "Done."
