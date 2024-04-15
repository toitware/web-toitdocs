# Ref to other

This test has a package with a .toit file that matches the package name. Specifically,
the package is called 'pkg', and there is a `src/pkg.toit` file.

That pkg.toit file references a class in a library `other.toit` that lives next to it.

The toitdoc viewer should show `pkg` as `import pkg`, instead of `import pkg.pkg`, and
unnest the main library. However, the references from `pkg` to `other` still need to work.
