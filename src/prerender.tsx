// Copyright (C) 2026 Toit contributors.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import { createStore } from "redux";
import { AppContent } from "./App";
import { theme } from "./assets/theme";
import ThemeProvider from "./components/ThemeProvider";
import { ToitObject } from "./generator/doc";
import { canonicalURL, docPage, docPaths, pageTitle } from "./misc/pages";
import { libraryFrom } from "./misc/util";
import { doc, fetchDoc } from "./redux/doc";

// Render sequentially: the converter currently stores its configuration globally.
export function renderer(data: ToitObject, canonicalBase: string) {
  const prefix = new URL(canonicalBase).pathname.replace(/\/$/, "");
  const state = doc.reducer(
    undefined,
    fetchDoc.fulfilled(data, "prerender", undefined)
  );
  const libraries = state.libraries!;
  const store = createStore(() => ({ doc: state }));
  const siteTitle =
    data.mode === "package"
      ? data.pkg_name || "Toitdocs"
      : data.mode === "sdk"
      ? "Standard libraries — Toit"
      : "Toitdocs";
  const paths = docPaths(libraries);
  const redirects: { [path: string]: string } = {};
  if (data.mode === "package" && paths.length > 1) redirects["/"] = paths[1];
  paths.slice(1).forEach((path) => {
    // Older SDK documentation exposed its source-root prefix in public URLs.
    if (data.mode === "sdk") redirects[`/toit/lib${path}`] = path;
    const slash = path.lastIndexOf("/");
    const libraryPath = path.slice(1, slash);
    const library = libraryFrom(libraryPath, libraries)!;
    if (library.hasSameNameModule && !library.libraries[library.name]) {
      redirects[`/${libraryPath}/${library.name}${path.slice(slash)}`] = path;
    }
  });
  return {
    paths: paths.filter((path) => !redirects[path]),
    redirects,
    render(path: string) {
      const page = docPage(path, libraries);
      const cache = createCache({ key: "css" });
      // Keep both MUI and tss-react styles for inclusion in the static head.
      cache.compat = true;
      const body = renderToString(
        <CacheProvider value={cache}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <StaticRouter basename={prefix} location={prefix + path}>
                <AppContent
                  libraries={libraries}
                  version={state.version}
                  sdkVersion={state.sdkVersion}
                  fetchDoc={() => undefined}
                />
              </StaticRouter>
            </ThemeProvider>
          </Provider>
        </CacheProvider>
      );
      return {
        body,
        title: pageTitle(page, siteTitle),
        canonical: page.found
          ? canonicalURL(page.path, canonicalBase)
          : undefined,
        css: Object.values(cache.inserted)
          .filter((value) => typeof value === "string")
          .join(""),
      };
    },
  };
}
