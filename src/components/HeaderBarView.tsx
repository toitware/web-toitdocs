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
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import SearchIcon from "@material-ui/icons/Search";
import Fuse from "fuse.js";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-simple.png";
import { librarySegmentsToURI } from "../sdk";
import ToitFuse, {
  SearchableToitClass,
  SearchableToitLibrary,
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

  render(): JSX.Element {
    const classes = this.props.classes;

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
        {this.state.resultsVisible &&
          this.state.results !== undefined &&
          this.renderResultsContainer()}
      </Grid>
    );
  }

  renderResultsContainer(): JSX.Element {
    let matches = [] as readonly Fuse.FuseResultMatch[];
    if (this.state.results !== undefined) {
      const unknownResults = this.state.results as unknown;
      const results = unknownResults as SearchResults;
      matches = results.matches;
    }
    if (matches.length !== 0) {
      return (
        <div id="SearchResults">
          <Grid
            container
            item
            xs={3}
            className={this.props.classes.searchResults}
          >
            <div className={this.props.classes.searchContainer}>
              {this.state.results !== undefined && (
                <List className={this.props.classes.searchList}>
                  {this.state.results !== undefined && (
                    <ListItem>
                      <Typography variant="h5" color="secondary">
                        Libraries
                      </Typography>
                    </ListItem>
                  )}
                  {this.renderSearch("libraries", this.state.results)}
                  {this.state.results !== undefined && (
                    <ListItem>
                      <Typography variant="h5" color="secondary">
                        Modules
                      </Typography>
                    </ListItem>
                  )}
                  {this.renderSearch("modules", this.state.results)}
                  {this.state.results !== undefined && (
                    <ListItem>
                      <Typography variant="h5" color="secondary">
                        Classes
                      </Typography>
                    </ListItem>
                  )}
                  {this.renderSearch("classes", this.state.results)}
                </List>
              )}
            </div>
          </Grid>
        </div>
      );
    } else {
      return (
        <div id="SearchResults">
          <Grid
            container
            item
            xs={3}
            className={this.props.classes.searchResults}
          >
            <div className={this.props.classes.searchContainer}>
              <List className={this.props.classes.searchList}>
                <ListItem>
                  <Typography variant="h5" color="secondary">
                    No results found
                  </Typography>
                </ListItem>
              </List>
            </div>
          </Grid>
        </div>
      );
    }
    // }
  }

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
      }, 200);
    }
  };

  handleClickAway = (): void => {
    this.setState({ ...this.state, resultsVisible: false });
  };

  handleClick = (): void => {
    this.setState({ ...this.state, resultsVisible: true });
  };

  renderSearch(
    type?: "libraries" | "classes" | "modules",
    results?: SearchResults
  ): JSX.Element {
    if (
      !results ||
      !results.isFilled ||
      results.matches.length === 0 ||
      type === undefined
    ) {
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
      // console.log("tu jestem");
      // console.log(fuseResults);
      // console.log(fuseResults.length);
      return (
        <>
          {fuseResults.map((match, index) => {
            if (typeof match.refIndex === "number") {
              if (type === "libraries") {
                try {
                  const unknownAfterSearch = afterSearch[
                    match.refIndex
                  ] as unknown;
                  const libAfterSearch = unknownAfterSearch as SearchableToitLibrary;
                  libString = "/" + libAfterSearch.name;
                  resultName = libAfterSearch.name;
                } catch {
                  console.log("Cast failed");
                }
              } else if (type === "modules") {
                try {
                  const unknownAfterSearch = afterSearch[
                    match.refIndex
                  ] as unknown;
                  const libAfterSearch = unknownAfterSearch as SearchableToitModule;
                  libString = `/${librarySegmentsToURI(
                    libAfterSearch.library
                  )}`;
                  moduleString = `/${libAfterSearch.name}`;
                  resultName = libAfterSearch.name;
                } catch {
                  console.log("Cast failed");
                }
              } else if (type === "classes") {
                try {
                  const unknownAfterSearch = afterSearch[
                    match.refIndex
                  ] as unknown;
                  const libAfterSearch = unknownAfterSearch as SearchableToitClass;
                  libString = `/${librarySegmentsToURI(
                    libAfterSearch.library
                  )}`;
                  moduleString = `/${libAfterSearch.module}`;
                  classString = `/${libAfterSearch.name}`;
                  resultName = libAfterSearch.name;
                } catch {
                  console.log("Cast failed");
                }
              }

              return (
                <Link
                  to={`${libString}${moduleString}${classString}`}
                  key={"list_item" + index}
                  onClick={this.handleClickAway}
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
}

export default withStyles(style)(HeaderBar);
