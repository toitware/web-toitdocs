import { createMuiTheme } from "@material-ui/core";
import { orange, amber, grey, yellow } from "@material-ui/core/colors";
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

// Search bar styling.
const headerBarStyling = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
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
    // vertical padding + font size from searchIcon
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

export {theme, headerBarStyling};
