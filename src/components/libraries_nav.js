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
  return ([].concat(props.libraries)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((library, index) => {
      return (
        <Link
          to={`/${library.name}`}
          key={`${index}_${library.name}`}
        >
          <ListItem button>{library.name}</ListItem>
        </Link>
      );
    }))
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
