/// <reference types="cypress" />

describe("Documentation Viewer", () => {
  beforeEach(() => {
    // Increase default timeout for all tests as loading/rendering might be slow, especially for SDK
    Cypress.config("defaultCommandTimeout", 30000);
  });

  const checkSidebarGroup = (label: string) => {
    // The sidebar might use different structures. This is a generic check.
    cy.contains(label).should("be.visible");
  };

  /**
   * Assert that the header bar does not overlap the sidebar.
   * Catches CSS box-model regressions (e.g. content-box vs border-box).
   */
  const assertNoHeaderSidebarOverlap = () => {
    cy.get('[data-testid="sidebar"]').then(($sidebar) => {
      const sidebarRight = $sidebar[0].getBoundingClientRect().right;
      cy.get("header").then(($header) => {
        const headerLeft = $header[0].getBoundingClientRect().left;
        expect(headerLeft).to.be.at.least(
          sidebarRight - 1,
          "Header should not overlap sidebar"
        );
      });
    });
  };

  describe("Package Mode", () => {
    beforeEach(() => {
      // Load the package-specific json
      cy.readFile("public/toitdoc_pkg.json").then((json) => {
        json.mode = "package";
        cy.intercept("GET", "/toitdoc.json", json).as("getDocs");
      });
      cy.visit("/");
      cy.wait("@getDocs");
    });

    it("loads the package view", () => {
      cy.get("body").should("contain.text", "pkg");
      // Enhanced assertions
      // Sidebar "Libraries" header
      cy.contains("h5", "Libraries").should("be.visible");
      // Sidebar "pkg" item
      cy.contains("pkg").should("be.visible");
      cy.contains("h3", "Functions").should("be.visible");
      // Check function signatures
      cy.contains("foo str/string").should("be.visible");
      cy.contains(" -> string").should("be.visible");
      cy.contains("bar a/A").should("be.visible");
      cy.contains(" -> A").should("be.visible");

      // Layout: header blur must not overlap the sidebar
      assertNoHeaderSidebarOverlap();
    });

    it("navigates to class A", () => {
      cy.contains("pkg").click();
      cy.contains("foo").should("be.visible");
      cy.contains("bar").should("be.visible");

      // Click on 'A' explicitly within the Classes section.
      // scrollIntoView first since the sidebar can overlap the link
      cy.contains("h3", "Classes")
        .parent()
        .parent()
        .within(() => {
          cy.contains("a", /^A$/).scrollIntoView().click({ force: true });
        });
      cy.contains("Class A").should("be.visible");

      // Enhanced assertions for Class A
      cy.contains("extends Object").should("be.visible");
      cy.contains("h3", "Methods").should("be.visible");
      cy.contains("operator == other/any").should("be.visible");
      cy.contains(" -> bool").should("be.visible");
      cy.contains("stringify").should("be.visible");
      cy.contains(" -> string").should("be.visible");
    });
  });

  describe("Folder/SDK Mode", () => {
    beforeEach(() => {
      // Load the folder/sdk-like json
      cy.readFile("public/toitdoc_folder.json").then((json) => {
        delete json.mode; // mode undefined means Folder view in doc.ts
        cy.intercept("GET", "/toitdoc.json", json).as("getDocs");
      });
      Cypress.config("defaultCommandTimeout", 30000);
      cy.visit("/");
      cy.wait("@getDocs");
      cy.get(".MuiCircularProgress-root").should("not.exist");
    });

    it("loads the folder view", () => {
      cy.get("body").should("contain.text", "pkg");
      // Enhanced assertions
      cy.contains("Toitdoc Viewer").should("be.visible");
      cy.contains("Welcome to the Toitdoc viewer").should("be.visible");
      cy.contains("Libraries").should("be.visible");
      cy.contains("other").should("be.visible");
      cy.contains("pkg").should("be.visible");
    });
  });

  describe("SDK Mode", () => {
    beforeEach(() => {
      // Load the sdk json
      cy.readFile("public/toitdoc_sdk.json").then((json) => {
        json.mode = "sdk";
        cy.intercept("GET", "/toitdoc.json", json).as("getDocs");
      });
      cy.visit("/");
      cy.wait("@getDocs");
    });

    it("loads the sdk view and shows Core library", () => {
      cy.get("body").should("contain.text", "core");
      // Navigate to 'core'
      cy.contains("core").click();

      // Enhanced assertions for SDK Core
      cy.contains("Library core").should("be.visible");
      cy.contains("h3", "Exported classes").should("be.visible");
      cy.contains("h3", "Exported functions").should("be.visible");

      // Check for common core classes/functions
      cy.contains("bool").should("be.visible");
      cy.contains("int").should("be.visible");
      cy.contains("string").should("be.visible");
      cy.contains("List").should("be.visible");
      cy.contains("print message/any").should("be.visible");
    });
  });
});
