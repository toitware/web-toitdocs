import { createMuiTheme } from "@material-ui/core";
import { orange, amber, grey, yellow } from "@material-ui/core/colors";

export const graphColors = [
  amber[700], orange[700], yellow[700]
]

// Note! If the theme colors change, the color placeholder in ../pkg/emailprovider/ must be manually updated

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: amber[500]
    },
    secondary: {
      main: grey[700]
    },
  },
  typography: {
    fontFamily: [
      "Segoe Pro Display"
    ].join(","),
    body1: {
      fontSize: "0.85rem",
    },
    body2: {
      fontSize: "0.80rem",
    },
    h1: {
      fontFamily: [
        "Canaro Light"
      ].join(","),
      fontSize: "4.0rem"
    },
    h2: {
      fontFamily: [
        "Canaro Light"
      ].join(","),
      fontSize: "3.0rem"
    },
    h3: {
      fontFamily: [
        "Canaro Light"
      ].join(","),
      fontSize: "2.5rem"
    },
    h4: {
      fontFamily: [
        "Canaro Light"
      ].join(","),
      fontSize: "2.5rem"
    },
    h5: {
      fontFamily: [
        "Canaro Light"
      ].join(","),
      fontSize: "1.25rem",
    },
    h6: {
      fontFamily: [
        "Canaro Light"
      ].join(","),
      padding: 0.5,
      fontSize: "1rem",
    },
  },
});

export {theme };
