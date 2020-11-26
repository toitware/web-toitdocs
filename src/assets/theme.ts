import { createMuiTheme } from "@material-ui/core";
import { orange, amber, yellow } from "@material-ui/core/colors";
import { fade, makeStyles } from "@material-ui/core/styles";

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
      main: "#212121"
    },
  },
  typography: {
    fontFamily: [
      "Helvetica Neue"
    ].join(","),
    body1: {
      fontSize: "0.85rem",
      lineHeight: "0.1rem",
    },
    body2: {
      fontSize: "0.80rem",
    },
    h1: {
      fontWeight: 500,
      fontFamily: [
        "Helvetica Neue"
      ].join(","),
      fontSize: "4.0rem"
    },
    h2: {
      fontWeight: 500,
      fontFamily: [
        "Helvetica Neue"
      ].join(","),
      fontSize: "3.0rem"
    },
    h3: {
      fontFamily: [
        "Helvetica Neue"
      ].join(","),
      fontSize: "2.0rem"
    },
    h4: {
      fontFamily: [
        "Helvetica Neue"
      ].join(","),
      fontSize: "1.5rem"
    },
    h5: {
      fontFamily: [
        "Helvetica Neue"
      ].join(","),
      fontSize: "1.25rem",
    },
    h6: {
      fontFamily: [
        "Helvetica Neue"
      ].join(","),
      padding: 0.5,
      fontSize: "1rem",
    },
  },
});

/*
// Search bar styling.
const header_bar_theme = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 0,
  },
  title: {
    flexGrow: 1,
    display: "none"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 1,
    paddingLeft: 1,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // Vertical padding + font size from searchIcon.
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("xs")]: {
      width: "30ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));
*/
export { theme };
