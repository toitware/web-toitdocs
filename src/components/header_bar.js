// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles, fade } from "@material-ui/core/styles";
import toitware from "./toitware.ico";
import { Grid } from "@material-ui/core";
import { AppBar } from "@material-ui/core";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import { fuse, fuseAliases, myIndex } from "./fuse.js";
import { List, ListItem } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { printResult } from "./search_component";


// Search bar styling.
const style = (theme) => ({
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

function mapStateToProps(state, props) {
  const { sdk } = state
  return { version: sdk.version, object: sdk.object, match: props.match }
}

class HeaderBar extends Component {
  // const [searchTerm, setSearchTerm] = useState("");
  // const [results, setResults] = useState([]);
  // const store = useStore();
  // const classes = headerBarStyling();

  constructor(props) {
    super();
    this.state = {
      searchTerm: "",
      results: [],
    }
  }

  setSearchTerm(searchTerm) {
    this.setState({ searchTerm });
  }

  setResults(results) {
    this.setState({ results });
  }

  handleChange = async(event) => {
    this.setSearchTerm(event.target.value);
    if (typeof event.target.value === "string") {
      if (event.target.value.length >= 2) {
        //Results of searching through libraries, modules and classes
        var found = await fuse.search(this.state.searchTerm);
        //Results of searching through aliases
        var found_aliases = await fuseAliases.search(this.state.searchTerm);
        var combined_results = {
          matches: [],
          refIndex: -1, //refIndex is used for finding the results in output object
          score: 1, // The lower the better the match is
          is_filled: true,
        };

        //Build one combined list of results
        if (found_aliases.length !== 0) {
          found_aliases.forEach((elem) => {
            elem.matches.forEach((match) => {
              let temp_match = match;
              temp_match.path = elem.item.path;
              combined_results.matches.push(temp_match);
            });
          });
          combined_results.scoreAlias = found_aliases[0].score;
        }

        if (found.length !== 0) {
          combined_results.matches = combined_results.matches.concat(
            found[0].matches
          );
          combined_results.refIndex = found[0].refIndex;
          combined_results.score = found[0].score;
        }
        setTimeout(this.setResults(combined_results), 200);
      } else {
        this.setResults({
          matches: [],
          refIndex: -1, //refIndex is used for finding the results in output object
          score: 1, // The lower the better the match is
          is_filled: false,
        });
      }
    }
  };

  noResultsMessage(result){
    var output = [];
    if (JSON.stringify(result.matches) ==="[]" && result.is_filled ===true){
      output.push("Nothing found")
    }
    return output;
  }

  returnType(item) {
    var output = "";
    try {
      output = item.Type.split(".").pop();
    } catch (err) {
      output = JSON.stringify(err);
    }
    return output;
  }

  render() {
    const classes = this.props.classes;

    return (
      <Grid container item xs={12} className={classes.root}>
        <Grid item xs={12}>
          <AppBar position="fixed">
            <Toolbar>
              <Grid item sm={9}>
                <Link to={`/`}>
                  <img alt="Toitware" src={toitware} width="32px" height="32px"></img>
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
              {printResult(this.props.object, this.state.results, myIndex).map((item, index) => {
                return (
                  <ListItem className="ListItem" button key={"list_item" + index}>
                    <div id="ElementOfList">
                      <Link to={`/${item.Path}`}>
                        {" "}
                        Name: <b> {item.Name} </b> Type: <b>{this.returnType(item)}</b>
                      </Link>
                    </div>
                  </ListItem>
                );
              })}
              {this.noResultsMessage(this.state.results).map((item) => {
                return (
                <ListItem className="ListItem" button key={"empty_message"}>
                  {item}
                </ListItem>
                );
              })}
            </List>
          </Grid>
        </div>
      </Grid>
    );
  }
}

export default withStyles(style, {withTheme: true})(connect(mapStateToProps)(HeaderBar));
