import { createMuiTheme } from "@material-ui/core";
import { orange, amber, yellow } from "@material-ui/core/colors";

export const graphColors = [amber[700], orange[700], yellow[700]];

// Note! If the theme colors change, the color placeholder in ../pkg/emailprovider/ must be manually updated

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: amber[500],
    },
    secondary: {
      main: "#212121",
    },
  },
  typography: {
    body1: {
      lineHeight: "0.1rem",
    },
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

export { theme };
