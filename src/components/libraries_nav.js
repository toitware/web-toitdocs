// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ErrorBoundary from "./error_page";

function mapStateToProps(state, props) {
  const { sdk } = state;
  return { version: sdk.version, libraries: sdk.object.libraries };
}

function LibList(props) {
  if (props.libraries !== undefined && props.libraries !== null) {
    return( [].concat(props.libraries)
      .sort((a, b) => a.lib_name.localeCompare(b.lib_name))
      .map((libraries, index) => {
        console.log(libraries.lib_name)
        return (
          <Link
            to={`/${libraries.lib_name}`}
            key={`${index}_${libraries.lib_name}`}
          >
            <ListItem button>{libraries.lib_name}</ListItem>
          </Link>
        );
      })
    )} else {
    console.log("function LibrariesNav(): No libraries found");
    return <div id="libraries_found"></div>;
  }
}
//Listing the libraries for navigation purposes
class LibrariesNav extends Component {
  render() {
    return (
      <div className="sideMenu">
        <ErrorBoundary>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                modules
              </ListSubheader>
            }
          >
            <LibList libraries={this.props.libraries}/>
          </List>
        </ErrorBoundary>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LibrariesNav);
