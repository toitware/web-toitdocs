// Copyright (C) 2026 Toit contributors.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

/// <reference types="cypress" />
export {};

describe("Documentation indexing metadata", () => {
  beforeEach(() => {
    cy.readFile("public/toitdoc_pkg.json").then((json) => {
      json.mode = "package";
      cy.intercept("GET", "/toitdoc.json", json);
    });
  });

  it("canonicalizes module aliases and updates metadata on navigation", () => {
    cy.visit("/pkg/pkg/library-summary?tracking=test#foo");
    cy.contains("Library pkg").should("be.visible");
    cy.location("origin").then((origin) => {
      cy.get('link[rel="canonical"]').should(
        "have.attr",
        "href",
        `${origin}/pkg/library-summary`
      );
    });
    cy.title().should("include", "Library pkg");
    cy.get('a[href="/pkg/class-A"]').first().click({ force: true });
    cy.contains("Class A").should("be.visible");
    cy.get('link[rel="canonical"]')
      .should("have.attr", "href")
      .and("match", /\/pkg\/class-A$/);
    cy.title().should("include", "A — pkg");
  });

  it("explains private omissions and clears noindex after leaving a missing page", () => {
    cy.visit("/pkg/class-Hidden_");
    cy.contains("Documentation for private classes is not included").should(
      "be.visible"
    );
    cy.get('meta[name="robots"]').should("have.attr", "content", "noindex");
    cy.get('link[rel="canonical"]').should("not.exist");
    cy.contains("Browse the documentation").click();
    cy.contains("Library pkg").should("be.visible");
    cy.get("meta[data-toitdoc-robots]").should("not.exist");
    cy.get('link[rel="canonical"]').should("exist");
  });
});
