// Copyright (C) 2026 Toit contributors.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { classFrom, libraryFrom, libraryUrlFromRef } from "./util";
import { Libraries } from "../model/model";

export interface DocPage {
  path: string;
  title: string;
  found: boolean;
}

export function docPage(pathname: string, libraries: Libraries): DocPage {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/") return { path, title: "", found: true };
  const match = /^\/(.+)\/(library-summary|class-(.+))$/.exec(path);
  if (match) {
    const library = libraryFrom(match[1], libraries);
    if (library) {
      const libraryPath = library.id.path.join("/");
      if (!match[3]) {
        return {
          path: libraryUrlFromRef(library.id),
          title: `Library ${libraryPath.replace(/\//g, ".")}`,
          found: true,
        };
      }
      const klass = classFrom(match[1], match[3], libraries);
      if (klass) {
        return {
          path: `/${libraryPath}/class-${klass.name}`,
          title: `${klass.name} — ${libraryPath.replace(/\//g, ".")}`,
          found: true,
        };
      }
    }
  }
  return { path, title: "Documentation unavailable", found: false };
}

export function docPaths(libraries: Libraries): string[] {
  const paths = ["/"];
  function visit(children: Libraries): void {
    Object.values(children).forEach((library) => {
      paths.push(libraryUrlFromRef(library.id));
      const classes = {
        ...library.classes,
        ...library.exportedClasses,
        ...library.interfaces,
        ...library.exportedInterfaces,
        ...library.mixins,
        ...library.exportedMixins,
      };
      Object.keys(classes).forEach((name) => {
        paths.push(`/${library.id.path.join("/")}/class-${name}`);
      });
      visit(library.libraries);
    });
  }
  visit(libraries);
  return paths;
}

export function pageTitle(page: DocPage, siteTitle: string): string {
  return page.title ? `${page.title} | ${siteTitle}` : siteTitle;
}

export function canonicalURL(path: string, base: string): string {
  return new URL(
    path.replace(/^\//, ""),
    base.endsWith("/") ? base : base + "/"
  ).href;
}
