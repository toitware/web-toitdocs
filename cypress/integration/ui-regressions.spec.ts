// Copyright (C) 2026 Toit contributors.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

/// <reference types="cypress" />
export {};

// Cypress supports suite configuration as the second argument.
// eslint-disable-next-line jest/valid-describe-callback
describe("UI migration regressions", { defaultCommandTimeout: 30000 }, () => {
  beforeEach(() => {
    cy.readFile("public/toitdoc_sdk.json").then((json) => {
      json.mode = "sdk";
      cy.intercept("GET", "/toitdoc.json", json).as("getDocs");
    });
    cy.visit("/");
    // eslint-disable-next-line testing-library/await-async-utils
    cy.wait("@getDocs");
    cy.contains("Toit standard libraries").should("be.visible");
  });

  it("applies global typography, link styling, and box sizing", () => {
    cy.get("body")
      .should("have.css", "margin", "0px")
      .and("have.css", "font-family", "Roboto");
    cy.get("footer").should("have.css", "box-sizing", "border-box");
    cy.get('a[href="https://pkg.toit.io/"]')
      .should("have.css", "color", "rgb(94, 111, 219)")
      .and("have.css", "text-decoration-line", "none");
  });

  it("shows library summaries in two columns", () => {
    cy.get('[class$="-libList"]').should("have.length.greaterThan", 0);
    cy.get('[class$="-libList"]').each(($list) => {
      cy.wrap($list).should("have.css", "column-count", "2");
    });
  });

  it("keeps pending search results dismissed after clicking outside", () => {
    cy.clock();
    cy.get('input[placeholder="Search"]').type("print");
    cy.contains("Toit standard libraries").click();
    cy.tick(201);
    cy.get(".MuiList-root").should("not.exist");

    // The completed search remains available when the user returns to it.
    cy.get('input[placeholder="Search"]').click();
    cy.get(".MuiList-root").should("be.visible").and("contain.text", "print");
  });
});
