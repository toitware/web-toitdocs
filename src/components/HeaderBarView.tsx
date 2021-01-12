// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  AppBar,
  ClickAwayListener,
  Grid,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import {
  createStyles,
  fade,
  StyleRules,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import SearchIcon from "@material-ui/icons/Search";
import Fuse from "fuse.js";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-simple.png";
import { ToitParameter } from "../generator/sdk";
import { librarySegmentsToURI } from "../redux/sdk";
import { getId } from "./Functions";
import ToitFuse, {
  SearchableToitClass,
  SearchableToitFunction,
  SearchableToitModule,
  SearchableToitObject,
} from "./fuse";

export const HEADER_BAR_HEIGHT = 64;

const style = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      flexGrow: 1,
      height: HEADER_BAR_HEIGHT,
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
    searchResults: {
      marginTop: "32px",
      maxHeight: "50%",
      position: "fixed",
      float: "left",
      zIndex: 1250,
    },
    searchList: {
      backgroundColor: theme.palette.primary.light,
      overflow: "auto",
    },
    searchContainer: {
      display: "flex",
      position: "fixed",
      maxHeight: "50%",
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
  });

interface SearchResults {
  matches: readonly Fuse.FuseResultMatch[];
  isFilled: boolean;
}

export interface HeaderBarProps extends WithStyles<typeof style> {
  searchObject: SearchableToitObject;
}

interface HeaderBarState {
  searchTerm: string;
  results?: SearchResults;
  resultsVisible?: boolean;
}

class HeaderBar extends Component<HeaderBarProps, HeaderBarState> {
  private fuse: ToitFuse;

  constructor(props: HeaderBarProps) {
    super(props);
    this.fuse = new ToitFuse(props.searchObject);
  }

  state = {
    searchTerm: "",
    results: undefined,
    resultsVisible: false,
  };

  setSearchTerm(searchTerm: string): void {
    this.setState({
      ...this.state,
      searchTerm: searchTerm,
      results: undefined,
    });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setSearchTerm(event.target.value);
    if (event.target.value.length >= 2) {
      //Results of searching through libraries, modules and classes
      const found = this.fuse.basic().search(this.state.searchTerm);
      let matches = [] as readonly Fuse.FuseResultMatch[];
      if (found.length !== 0 && found[0].matches) {
        matches = found[0].matches;
      }
      setTimeout(() => {
        this.setState({
          ...this.state,
          results: { matches: matches, isFilled: true },
          resultsVisible: true,
        });
      }, 100);
    } else {
      setTimeout(() => {
        this.setState({
          ...this.state,
          results: { matches: [], isFilled: false },
          resultsVisible: false,
        });
      }, 100);
    }
  };

  handleClickAway = (): void => {
    this.setState({ ...this.state, resultsVisible: false });
  };

  handleClick = (): void => {
    if (this.state.searchTerm.length >= 2) {
      setTimeout(() => {
        this.setState({ ...this.state, resultsVisible: true });
      }, 200);
    } else {
      setTimeout(() => {
        this.setState({ ...this.state, resultsVisible: false });
      }, 200);
    }
  };

  renderSearchResults(
    type: "libraries" | "classes" | "modules" | "functions",
    results?: SearchResults
  ): JSX.Element {
    if (!results || !results.isFilled || results.matches.length === 0) {
      return <></>;
    }

    const fuseResults: Fuse.FuseResultMatch[] = [];
    results.matches.forEach((match, index) => {
      if (match.refIndex === undefined) {
        console.error("missing refindex for match", match);
      } else if (match.key === `${type}.name`) {
        fuseResults.push(match);
        return match;
      }
    });
    const afterSearch = this.props.searchObject[type];
    let libString = "";
    let moduleString = "";
    let classString = "";
    let resultName = "";
    let funParams: ToitParameter[];
    let funIDString = "";
    if (fuseResults.length === 0) {
      return (
        <ListItem className="ListItem">
          <Typography variant="body2" color="secondary">
            {" "}
            No result found{" "}
          </Typography>
        </ListItem>
      );
    } else {
      return (
        <>
          {fuseResults.map((match, index) => {
            if (typeof match.refIndex === "number") {
              if (type === "libraries") {
                try {
                  const resultAfterSearch = afterSearch[match.refIndex];
                  libString = "/" + resultAfterSearch.name;
                  resultName = resultAfterSearch.name;
                } catch {
                  console.log("Cast failed");
                }
              } else if (type === "modules") {
                try {
                  const resultAfterSearch = afterSearch[
                    match.refIndex
                  ] as SearchableToitModule;
                  if (resultAfterSearch.library.includes("font")) {
                    return null;
                  }
                  libString = `/${librarySegmentsToURI(
                    resultAfterSearch.library
                  )}`;
                  moduleString = `/${resultAfterSearch.name}`;
                  resultName = resultAfterSearch.name;
                } catch {
                  console.log("Cast failed");
                }
              } else if (type === "classes") {
                try {
                  const resultAfterSearch = afterSearch[
                    match.refIndex
                  ] as SearchableToitClass;
                  if (resultAfterSearch.library.includes("font")) {
                    return null;
                  }
                  libString = `/${librarySegmentsToURI(
                    resultAfterSearch.library
                  )}`;
                  moduleString = `/${resultAfterSearch.module}`;
                  classString = `/${resultAfterSearch.name}`;
                  resultName = resultAfterSearch.name;
                } catch {
                  console.log("Cast failed");
                }
              } else if (type === "functions") {
                try {
                  const resultTempAfterSearch = afterSearch[
                    match.refIndex
                  ] as unknown;
                  const resultAfterSearch = resultTempAfterSearch as SearchableToitFunction;
                  funParams = resultAfterSearch.functionParameters;
                  libString = `/${librarySegmentsToURI(
                    resultAfterSearch.library
                  )}`;
                  moduleString = `/${resultAfterSearch.module}`;
                  classString = `/${resultAfterSearch.class}`;
                  resultName = resultAfterSearch.name;
                  funIDString = "#" + getId(resultName, funParams);
                } catch {
                  console.log("Cast failed");
                }
              }
              return (
                <Link
                  to={`${libString}${moduleString}${classString}${funIDString}`}
                  onClick={this.handleClickAway}
                  key={"list_item" + index}
                >
                  <ListItem className="ListItem" button>
                    <Typography variant="h6" color="secondary">
                      {" "}
                      {resultName}{" "}
                    </Typography>
                  </ListItem>
                </Link>
              );
            } else {
              return null;
            }
          })}
        </>
      );
    }
  }

  render(): JSX.Element {
    const classes = this.props.classes;
    let matches = [] as readonly Fuse.FuseResultMatch[];
    if (this.state.results !== undefined) {
      const unknownResults = this.state.results as unknown;
      const results = unknownResults as SearchResults;
      matches = results.matches;
    }
    return (
      <Grid container item xs={12} className={classes.root}>
        <Grid item xs={12}>
          <AppBar position="fixed" elevation={0}>
            <Toolbar>
              <Grid item sm={9}>
                <Link to={`/`}>
                  <img alt="Toitware" src={logo} height="32px"></img>
                </Link>
              </Grid>
              <Grid item sm={3}>
                <ClickAwayListener onClickAway={this.handleClickAway}>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ "aria-label": "search" }}
                      value={this.state.searchTerm}
                      onChange={this.handleChange}
                      onClick={this.handleClick}
                    />
                  </div>
                </ClickAwayListener>
              </Grid>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={9}></Grid>
        {this.state.resultsVisible && matches.length === 0 && (
          <div id="SearchResults">
            <Grid
              container
              item
              xs={3}
              className={this.props.classes.searchResults}
            >
              <List className={this.props.classes.searchList}>
                <ListItem>
                  <Typography variant="h5" color="secondary">
                    No results found
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </div>
        )}
        {this.state.resultsVisible && matches.length !== 0 && (
          <div id="SearchResults">
            <Grid
              container
              item
              xs={3}
              className={this.props.classes.searchResults}
            >
              <div className={this.props.classes.searchContainer}>
                <List className={this.props.classes.searchList}>
                  {this.state.results !== undefined && (
                    <ListItem>
                      <Typography variant="h5" color="secondary">
                        Libraries
                      </Typography>
                    </ListItem>
                  )}
                  {this.renderSearchResults("libraries", this.state.results)}
                  {this.state.results !== undefined && (
                    <ListItem>
                      <Typography variant="h5" color="secondary">
                        Modules
                      </Typography>
                    </ListItem>
                  )}
                  {this.renderSearchResults("modules", this.state.results)}
                  {this.state.results !== undefined && (
                    <ListItem>
                      <Typography variant="h5" color="secondary">
                        Classes
                      </Typography>
                    </ListItem>
                  )}
                  {this.renderSearchResults("classes", this.state.results)}
                  {this.state.results !== undefined && (
                    <ListItem>
                      <Typography variant="h5" color="secondary">
                        Functions
                      </Typography>
                    </ListItem>
                  )}
                  {this.renderSearchResults("functions", this.state.results)}
                </List>
              </div>
            </Grid>
          </div>
        )}
      </Grid>
    );
  }
}

export default withStyles(style)(HeaderBar);
