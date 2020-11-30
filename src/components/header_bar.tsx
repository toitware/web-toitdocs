// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  withStyles,
  fade,
  Theme,
  createStyles,
  WithStyles,
} from "@material-ui/core/styles";
import toitware from "./toitware.ico";
import { Grid } from "@material-ui/core";
import { AppBar } from "@material-ui/core";
import { Link, match } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Fuse, { SearchableToitObject } from "./fuse";
import { List, ListItem } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { librarySegmentsToURI, RootState } from "../sdk";
import { ToitLibraries, ToitLibrary } from "../model/toitsdk";
import ToitFuse from "./fuse";

// Search bar styling.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const style = (theme: Theme) =>
  createStyles({
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
  });

function mapStateToProps(
  state: RootState,
  props: HeaderBarProps
): HeaderBarProps {
  return {
    ...props,
    searchObject: state.searchObject || {},
    libraries: state.object?.libraries || {},
  };
}

interface SearchResults {
  matches: SearchableToitObject[];
  isFilled: boolean;
}

interface HeaderBarProps extends WithStyles<typeof style> {
  searchObject: SearchableToitObject;
  libraries: ToitLibraries;
}

interface HeaderBarState {
  searchTerm: string;
  results?: SearchResults;
}

class HeaderBar extends Component<HeaderBarProps, HeaderBarState> {
  private fuse: ToitFuse;

  constructor(props: HeaderBarProps) {
    super(props);
    this.fuse = new ToitFuse(props.searchObject, props.libraries);
  }

  state = {
    searchTerm: "",
    results: undefined,
  };

  setSearchTerm(searchTerm: string): void {
    this.setState({ ...this.state, searchTerm: searchTerm });
  }

  setResults(results: SearchResults): void {
    this.setState({ ...this.state, results: results });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setSearchTerm(event.target.value);
    if (event.target.value.length >= 2) {
      //Results of searching through libraries, modules and classes
      const found = this.fuse.basic().search(this.state.searchTerm);
      //Results of searching through aliases
      // const foundAliases = this.fuse.aliases().search(this.state.searchTerm);
      const combinedResults = {
        matches: [],
        refIndex: -1, //refIndex is used for finding the results in output object
        isFilled: true,
      };

      //Build one combined list of results
      // if (foundAliases.length !== 0) {
      //   foundAliases.forEach((elem) => {
      //     elem.matches.forEach((match) => {
      //       const tempMatch = match;
      //       tempMatch.path = elem.item.path;
      //       combinedResults.matches.push(tempMatch);
      //     });
      //   });
      //   combinedResults.scoreAlias = foundAliases[0].score;
      // }

      if (found.length !== 0) {
        combinedResults.matches = combinedResults.matches.concat(
          found[0].matches
        );
        combinedResults.refIndex = found[0].refIndex;
        // combinedResults.score = found[0].score;
      }
      setTimeout(this.setResults(combinedResults), 200);
    }
  };

  renderSearchResult(): JSX.Element {
    const results = this.state.results;
    if (!results || !results.isFilled) {
      return <></>;
    }

    if (results.matches.length === 0) {
      return <>no results</>;
    }

    // TODO: Enable search on aliases
    return results.matches.map((match, index) => {
      switch (match.key) {
        case "classes.name":
          const klass = this.props.searchObject.classes[match.refIndex];
          return (
            <ListItem className="ListItem" button key={"list_item" + index}>
              <div id="ElementOfList">
                <Link
                  to={`/${librarySegmentsToURI(klass.library)}/${
                    klass.module
                  }/${klass.name}`}
                >
                  {" "}
                  Name: <b> {klass.name} </b> Type: <b>Class</b>
                </Link>
              </div>
            </ListItem>
          );
        case "libraries.name":
          const library = this.props.searchObject.libraries[match.refIndex];
          return (
            <ListItem className="ListItem" button key={"list_item" + index}>
              <div id="ElementOfList">
                <Link to={`/${librarySegmentsToURI(library.path)}`}>
                  {" "}
                  Name: <b> {library.name} </b> Type: <b>Library</b>
                </Link>
              </div>
            </ListItem>
          );
        case "modules.name":
          const module = this.props.searchObject.modules[match.refIndex];
          return (
            <ListItem className="ListItem" button key={"list_item" + index}>
              <div id="ElementOfList">
                <Link
                  to={`/${librarySegmentsToURI(module.library)}/${module.name}`}
                >
                  {" "}
                  Name: <b> {module.name} </b> Type: <b>Module</b>
                </Link>
              </div>
            </ListItem>
          );
        default:
          console.error("unhandled search result", match);
          return null;
      }
    });
  }

  render(): JSX.Element {
    const classes = this.props.classes;

    return (
      <Grid container item xs={12} className={classes.root}>
        <Grid item xs={12}>
          <AppBar position="fixed">
            <Toolbar>
              <Grid item sm={9}>
                <Link to={`/`}>
                  <img
                    alt="Toitware"
                    src={toitware}
                    width="32px"
                    height="32px"
                  ></img>
                </Link>
              </Grid>
              <Grid item sm={3}>
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
                  />
                </div>
              </Grid>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={9}></Grid>
        <div id="SearchResults">
          <Grid
            container
            item
            xs={3}
            style={{
              marginTop: "65px",
              maxHeight: "50%",
              overflow: "auto",
              position: "fixed",
              float: "left",
              borderRadius: "5px",
            }}
          >
            <List style={{ backgroundColor: "grey" }}>
              {this.renderSearchResult()}
            </List>
          </Grid>
        </div>
      </Grid>
    );
  }
}

export default connect(mapStateToProps)(withStyles(style)(HeaderBar));
