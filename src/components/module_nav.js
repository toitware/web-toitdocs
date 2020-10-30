// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemLink from "./list_item_link.js";
import List from "@material-ui/core/List";
import ErrorBoundary from "./error_page";
import {
  getLibrary,
  librarySegmentsToName,
  librarySegmentsToURI,
} from "../sdk.js";
import Typography from "@material-ui/core/Typography";

function mapStateToProps(state, props) {
  const { sdk } = state;
  return {
    version: sdk.version,
    libraries: sdk.object.libraries,
    match: props.match,
  };
}

//Listing modules for navigation purposes
class ModuleNav extends Component {
  renderModule(library, module) {
    const libraryName = librarySegmentsToName(library.path);
    const libraryURI = librarySegmentsToURI(library.path);
    return (
      <ListItemLink
        to={`/${libraryURI}/${module.name}`}
        key={`/${libraryName}/${module.name}`}
        primary={module.name}
      />
    );
  }
  render() {
    const {
      params: { libName, moduleName },
    } = this.props.match;

    console.log(moduleName);
    const library = getLibrary(this.props.libraries, libName);
    const moduleNames = Object.keys(library.modules).sort();
    console.log(library.path);
    return (
      <div className="sideMenu" style={{ paddingTop: "10px" }}>
        <ErrorBoundary>
          <List
            component="nav"
            disablePadding
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                <Link to={`/`}>Modules</Link>
                <Typography color="secondary">
                  {" / "}
                  {moduleName}
                </Typography>
              </ListSubheader>
            }
          >
            {moduleNames.map((moduleName) =>
              this.renderModule(library, library.modules[moduleName])
            )}
          </List>
        </ErrorBoundary>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ModuleNav);
