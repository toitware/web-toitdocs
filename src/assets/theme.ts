import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  layout: {
    sidebarWidth: "10rem",
    headerHeight: 64,
  },
  palette: {
    type: "light",
    primary: {
      main: "#d7dce1",
    },
    secondary: {
      main: "#212121",
    },
  },
  typography: {
    body1: {},
    body2: {
      fontSize: "0.80rem",
    },
    h1: {
      fontSize: "4.0rem",
    },
    h2: {
      fontSize: "3.0rem",
    },
    h3: {
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

/**
 * Since material-ui lengths can be defined as numbers (pixels) we need to
 * convert them sometimes.
 *
 * I've searched in the material-ui code for about an hour, since there must be
 * a util there, but I couldn't find it.
 */
export function lengthToString(length: number | string): string {
  return typeof length === "string" ? length : `${length}px`;
}

export { theme };
