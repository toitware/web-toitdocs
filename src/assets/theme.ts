import { createMuiTheme } from "@material-ui/core";

const layout = {
  sidebarWidth: "18rem",
  headerHeight: 64,
  footerHeight: "6rem",
};

export const theme = createMuiTheme({
  layout: layout,
  palette: {
    type: "light",
    background: {
      paper: "#fff",
      default: "#fff",
    },
    text: {
      primary: "#000",
    },
    primary: {
      main: "#5E6FDB",
    },
    secondary: {
      main: "#55A398",
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica, sans-serif",
    body1: {},
    body2: {
      fontSize: "0.80rem",
    },
    h1: {
      fontFamily: "ClashDisplay",
      fontSize: "4.0rem",
    },
    h2: {
      fontFamily: "ClashDisplay",
      fontSize: "3.0rem",
    },
    h3: {
      fontFamily: "ClashDisplay",
      fontSize: "2.0rem",
    },
    h4: {
      fontSize: "1.5rem",
    },
    h5: {
      fontSize: "1.25rem",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
});

export const sideBarTheme = createMuiTheme({
  layout: layout,
  palette: {
    type: "dark",
    background: {
      paper: "#000",
      default: "#000",
    },
    text: {
      primary: "#fff",
    },
    primary: {
      main: "#FAC864",
    },
    secondary: {
      main: "#5E6FDB",
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica, sans-serif",
    body1: {},
    body2: {
      fontSize: "0.80rem",
    },
  },
});

/**
 * Since material-ui lengths can be defined as numbers (pixels) we need to
 * convert them sometimes.
 *
 * I've searched in the material-ui code for about an hour, since there must be
 * a util there, but I couldn't find it.
 */
export function length(length: number | string): string {
  return typeof length === "string" ? length : `${length}px`;
}
