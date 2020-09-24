// Copyright (C) 2020 Toitware ApS. All rights reserved.

import toitware from "./toitware.ico";
import { Grid } from "@material-ui/core";
import { AppBar } from "@material-ui/core";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import {headerBarStyling} from "../assets/theme"
import React, { useState } from "react";
import { fuse } from "./fuse.js";
import { fuseAliases } from "./fuse.js";
import { myIndex } from "./fuse.js";
import { List } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { printResult } from "./search_component";



function HeaderBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const classes = headerBarStyling();

  const handleChange = async (event) => {
    setSearchTerm(event.target.value);
    if (typeof event.target.value === "string") {
      if (event.target.value.length >= 2) {
        //Results of searching through libraries, modules and classes
        var found = await fuse.search(searchTerm);
        //Results of searching through aliases
        var found_aliases = await fuseAliases.search(searchTerm);
        var combined_results = {
          matches: [],
          refIndex: -1, //refIndex is used for finding the results in output object
          score: 1, // The lower the better the match is
          is_filled: true,
        };

        //Build one combined list of results
        if (found_aliases.length !== 0) {
          found_aliases.map((elem) => {
            elem.matches.map((match) => {
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
        setTimeout(setResults(combined_results), 200);
      } else {
        setResults({
          matches: [],
          refIndex: -1, //refIndex is used for finding the results in output object
          score: 1, // The lower the better the match is
          is_filled: false,
        });
      }
    }
  };

  function noResultsMessage(result){
    var output = [];
    if (JSON.stringify(result.matches) ==="[]" && result.is_filled ===true){
      output.push("Nothing found")
    }
    return output;
  }

  function returnType(item) {
    var output = "";
    try {
      output = item.Type.split(".").pop();
    } catch (err) {
      output = JSON.stringify(err);
    }
    return output;
  }
  return (
    <Grid container item xs={12} className={classes.root}>
      <Grid item xs={12}>
        <AppBar position="fixed">
          <Toolbar>
            <Grid item sm={9}>
              <Link to={`/`}>
                <img src={toitware} width="32px" height="32px"></img>
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
                  value={searchTerm}
                  onChange={handleChange}
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
            {printResult(results, myIndex).map((item, index) => {
              return (
                <ListItem className="ListItem" button key={"list_item" + index}>
                  <div id="ElementOfList">
                    <Link to={`/${item.Path}`}>
                      {" "}
                      Name: <b> {item.Name} </b> Type: <b>{returnType(item)}</b>
                    </Link>
                  </div>
                </ListItem>
              );
            })}
            {noResultsMessage(results).map((item) => {
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

export default HeaderBar;
