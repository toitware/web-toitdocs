// Copyright (C) 2026 Toit contributors.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalURL, docPage, pageTitle } from "../misc/pages";
import { Libraries } from "../model/model";

export default function PageMetadata(props: {
  libraries: Libraries;
  siteTitle: string;
}): null {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = docPage(pathname, props.libraries);
    document.title = pageTitle(page, props.siteTitle);
    // Only manage our robots tag; do not remove a host's indexing policy.
    document.querySelector("meta[data-toitdoc-robots]")?.remove();
    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!page.found) {
      canonical?.remove();
      const robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex";
      robots.setAttribute("data-toitdoc-robots", "");
      document.head.appendChild(robots);
      return;
    }
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const base =
      document
        .querySelector('meta[name="toitdoc-canonical-base"]')
        ?.getAttribute("content") || document.baseURI;
    canonical.href = canonicalURL(page.path, base);
  }, [pathname, props.libraries, props.siteTitle]);
  return null;
}
