/// <reference types="cypress" />
export { };

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

    it("searches and shows results", () => {
      // Type "foo" into the search bar
      cy.get('input[placeholder="Search"]').type("foo");
      // Wait for debounce (200ms) and results to render
      cy.contains("function", { timeout: 5000 }).should("be.visible");

      // Search results should show the foo function
      cy.get(".MuiList-root").within(() => {
        cy.contains("foo").should("be.visible");
        cy.contains("function").should("be.visible");
        cy.contains("from pkg").should("be.visible");
      });

      // Click the search result and verify navigation
      cy.get(".MuiList-root").contains("foo").click();
      cy.url().should("include", "library-summary");
      cy.url().should("include", "foo");
    });

    it("clears search results", () => {
      // Type into search
      cy.get('input[placeholder="Search"]').type("foo");
      cy.get(".MuiList-root", { timeout: 5000 }).should("exist");

      // Click the clear icon (the X button next to search)
      // The ClearIcon is a sibling of InputBase inside the Box container
      cy.get('input[placeholder="Search"]')
        .closest(".MuiBox-root")
        .find("svg")
        .last()
        .click();

      // Results should disappear
      cy.get(".MuiList-root").should("not.exist");
      cy.get('input[placeholder="Search"]').should("have.value", "");
    });

    it("has correct sidebar links", () => {
      const expectedSidebarLinks = [
        { text: ".packages", href: "/.packages/library-summary" },
        { text: "@", href: "/@/library-summary" },
        { text: "pkg", href: "/pkg/library-summary" },
        { text: "other", href: "/pkg/other/library-summary" },
      ];

      cy.get('[data-testid="sidebar"]').within(() => {
        // Logo links home
        cy.get('a[href="/"]').should("exist");

        expectedSidebarLinks.forEach(({ text, href }) => {
          cy.contains("a", text).should("have.attr", "href", href);
        });
      });
    });

    it("has correct content links on library summary", () => {
      // Navigate to pkg library summary
      cy.contains("pkg").click();
      cy.contains("Library pkg").should("be.visible");

      // Type reference links in the toitdoc section
      cy.contains("a", "other.B").should(
        "have.attr",
        "href",
        "/pkg/other/class-B"
      );
      cy.contains("a", /^A$/)
        .first()
        .should("have.attr", "href", "/pkg/class-A");
      cy.contains("a", "string")
        .first()
        .should("have.attr", "href")
        .and("include", "class-string");
      cy.contains("a", "BITS-PER-BYTE")
        .should("have.attr", "href")
        .and("include", "BITS-PER-BYTE");
      cy.contains("a", "morse.DASH")
        .should("have.attr", "href")
        .and("include", "DASH");
      cy.contains("a", "file.copy")
        .should("have.attr", "href")
        .and("include", "copy");

      // Function anchor links
      cy.contains("h3", "Functions")
        .parent()
        .parent()
        .within(() => {
          cy.contains("a", "bar")
            .should("have.attr", "href")
            .and("include", "bar");
          cy.contains("a", "foo")
            .should("have.attr", "href")
            .and("include", "foo");
        });
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
