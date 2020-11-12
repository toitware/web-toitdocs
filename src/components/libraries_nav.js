// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import ListItemLink from "./list_item_link.js";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ErrorBoundary from "./error_page";
import {
  librarySegmentsToName,
  getLibrary,
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

//Listing the libraries for navigation purposes
class LibrariesNav extends Component {
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

  renderLibrary(library) {
    const libraryName = librarySegmentsToName(library.path);
    const libraryURI = librarySegmentsToName(library.path);
    return (
      <ListItemLink
        to={`/${libraryURI}`}
        key={`/${libraryName}`}
        primary={library.name}
      />
    );
  }

  render() {
    const {
      params: { libName },
    } = this.props.match;

    const library = getLibrary(this.props.libraries, libName);
    const moduleNames = Object.keys(library.modules).sort();
    const libraryNames = Object.keys(library.libraries).sort();

    return (
      <div className="sideMenu" style={{paddingTop: "20px"}}>
        <ErrorBoundary>
          <List>
            <div className="sideMenu" style={{paddingTop: "20px"}}>
            <ListSubheader>
              <Typography color="secondary"><b>Libraries</b></Typography>
            </ListSubheader>
            </div>
            <div className="sideMenu" style={{paddingTop: "20px"}}>
            {libraryNames.map((libraryName) =>
              this.renderLibrary(library.libraries[libraryName])
            )}
            </div>
            <div className="sideMenu" style={{paddingTop: "20px"}}>
            <ListSubheader>
              <Typography color="secondary"><b>Modules</b></Typography>
            </ListSubheader>
            </div>
            <div className="sideMenu" style={{paddingTop: "20px"}}>
            {moduleNames.map((moduleName) =>
              this.renderModule(library, library.modules[moduleName])
            )}
            </div>
          </List>
        </ErrorBoundary>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LibrariesNav);
