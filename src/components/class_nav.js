// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ErrorBoundary from "./error_page";
import { getLibrary } from "../sdk";
import ListItemLink from "./list_item_link";
import Typography from "@material-ui/core/Typography";

function mapStateToProps(state, props) {
  const { sdk } = state;
  return {
    version: sdk.version,
    libraries: sdk.object.libraries,
    match: props.match,
  };
}

class ClassNav extends Component {
  render() {
    const {
      params: { libName, moduleName, className },
    } = this.props.match;

    const library = getLibrary(this.props.libraries, libName);
    const module = library && library.modules[moduleName];

    if (module) {
      const classes = []
        .concat(module.classes)
        .sort((a, b) => a.name.localeCompare(b.name));

      return (
        <div className="sideMenu" style={{ paddingTop: "30px" }}>
          <ErrorBoundary>
            <List
              component="nav"
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  <Link to={`/`}>Modules /</Link>
                  <Typography color="secondary">
                    <Link to={`/${libName}/${moduleName}`}>{moduleName}</Link>
                    {" / "}
                    <h1><p></p></h1>
                    {className}
                  </Typography>
                </ListSubheader>
              }
            >
            <br>
            </br>
              {" "}
              {classes.map((klass, index) => (
                <ListItemLink
                  to={`/${libName}/${module.name}/${klass.name}`}
                  key={"class-index-" + index}
                  primary={klass.name}
                />
              ))}
            </List>
          </ErrorBoundary>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default connect(mapStateToProps)(ClassNav);
