/** @jest-environment node */
// Copyright (C) 2026 Toit contributors.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

// These tests inspect server-rendered HTML, not Testing Library render results.
/* eslint-disable testing-library/render-result-naming-convention */
import { expect } from "@jest/globals";
import { renderer } from "./prerender";
import { ToitObject } from "./generator/doc";

function fixture(): ToitObject {
  const module = {
    object_type: "module",
    name: "foo",
    is_private: false,
    classes: [
      {
        object_type: "class",
        name: "Public",
        kind: "class",
        is_private: false,
        interfaces: [],
        mixins: [],
        structure: {
          fields: [],
          constructors: [],
          factories: [],
          statics: [],
          methods: [],
        },
      },
    ],
    functions: [],
    globals: [],
    interfaces: [],
    mixins: [],
    export_classes: [],
    export_interfaces: [],
    export_mixins: [],
    export_functions: [],
    export_globals: [],
  };
  return {
    mode: "sdk",
    sdk_version: "test",
    contains_sdk: true,
    libraries: {
      foo: {
        object_type: "library",
        name: "foo",
        path: [],
        libraries: {},
        modules: { foo: module },
      },
    },
  } as unknown as ToitObject;
}

describe("static documentation", () => {
  it("renders documentation, navigation, code, and styles without a browser", () => {
    const site = renderer(fixture(), "https://libs.toit.io/");
    const page = site.render("/foo/library-summary");
    expect(page.body).toContain("Library ");
    expect(page.body).toContain("Public");
    expect(page.body).toContain("import foo");
    expect(page.body).toContain('href="/foo/class-Public"');
    expect(page.css).toContain("box-sizing:border-box");
    expect(page.title).toBe("Library foo | Standard libraries — Toit");
    expect(page.canonical).toBe("https://libs.toit.io/foo/library-summary");
    expect(site.paths).toEqual([
      "/",
      "/foo/library-summary",
      "/foo/class-Public",
    ]);
  });

  it("maps directory/module aliases to the same canonical page", () => {
    const site = renderer(fixture(), "https://libs.toit.io/");
    expect(site.redirects["/foo/foo/library-summary"]).toBe(
      "/foo/library-summary"
    );
    expect(site.render("/foo/foo/class-Public").canonical).toBe(
      "https://libs.toit.io/foo/class-Public"
    );
    expect(site.render("/foo/foo/library-summary").body).toContain(
      "import foo"
    );
    expect(site.render("/foo/foo/foo/class-Public").canonical).toBeUndefined();
  });

  it("redirects legacy SDK paths only to pages that still exist", () => {
    const site = renderer(fixture(), "https://libs.toit.io/");
    expect(site.redirects["/toit/lib/foo/class-Public"]).toBe(
      "/foo/class-Public"
    );
    expect(site.redirects["/toit/lib/foo/class-Removed"]).toBeUndefined();
    const data = fixture();
    data.mode = "package";
    expect(
      renderer(data, "https://pkg.toit.io/foo/docs/").redirects[
        "/toit/lib/foo/class-Public"
      ]
    ).toBeUndefined();
  });

  it("keeps real same-name child libraries separate", () => {
    const data = fixture();
    data.libraries.foo.libraries.foo = fixture().libraries.foo;
    const site = renderer(data, "https://libs.toit.io/");
    expect(site.redirects["/foo/foo/library-summary"]).toBeUndefined();
    expect(site.render("/foo/foo/library-summary").canonical).toBe(
      "https://libs.toit.io/foo/foo/library-summary"
    );
  });

  it("explains omitted private classes without publishing missing pages", () => {
    const site = renderer(fixture(), "https://libs.toit.io/");
    const missing = site.render("/foo/class-Hidden_");
    expect(missing.body).toContain(
      "Documentation for private classes is not included"
    );
    expect(missing.canonical).toBeUndefined();
    expect(site.paths).not.toContain("/foo/class-Hidden_");
    expect(site.render("/missing/class-Hidden_").body).not.toContain(
      "Private class"
    );
    expect(site.render("/nonsense").canonical).toBeUndefined();
  });

  it("links private classes only when their documentation is included", () => {
    const data = fixture();
    const module = data.libraries.foo.modules.foo;
    module.classes[0].extends = {
      object_type: "reference",
      name: "Hidden_",
      path: ["foo.toit"],
    };
    let page = renderer(data, "https://libs.toit.io/").render(
      "/foo/class-Public"
    );
    expect(page.body).toContain("Hidden_");
    expect(page.body).not.toContain('href="/foo/class-Hidden_"');
    module.classes.push({ ...module.classes[0], name: "Hidden_" });
    page = renderer(data, "https://libs.toit.io/").render("/foo/class-Public");
    expect(page.body).toContain('href="/foo/class-Hidden_"');
  });

  it("renders package links and canonicals under the deployment prefix", () => {
    const data = fixture();
    data.mode = "package";
    data.pkg_name = "foo";
    const site = renderer(data, "https://pkg.toit.io/example/foo@1.0/docs/");
    const page = site.render("/foo/class-Public");
    expect(page.body).toContain(
      'href="/example/foo@1.0/docs/foo/library-summary"'
    );
    expect(page.canonical).toBe(
      "https://pkg.toit.io/example/foo@1.0/docs/foo/class-Public"
    );
    expect(site.redirects["/"]).toBe("/foo/library-summary");
    expect(site.paths).not.toContain("/");
  });
});
