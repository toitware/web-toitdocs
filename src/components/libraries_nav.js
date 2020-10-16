// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import ListItemLink from "./list_item_link.js";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ErrorBoundary from "./error_page";
import { librarySegmentsToName, getLibrary } from "../sdk.js";

function mapStateToProps(state, props) {
  const { sdk } = state;
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match };
}

//Listing the libraries for navigation purposes
class LibrariesNav extends Component {
  renderModule(libraryName, module) {
    return <ListItemLink to={`/${libraryName}/${module.name}`} key={`/${libraryName}/${module.name}`} primary={module.name} />
  }

  renderLibrary(library) {
    const libraryName = librarySegmentsToName(library.path);
    return <ListItemLink to={`/${libraryName}`} key={`/${libraryName}`} primary={library.name} />
  }

  render() {
    const { params: { libName } } = this.props.match;

    const library = getLibrary(this.props.libraries, libName);
    const moduleNames = Object.keys(library.modules).sort();
    const libraryNames = Object.keys(library.libraries).sort();
    const libraryName = librarySegmentsToName(library.path);

    return (
      <div className="sideMenu">
        <ErrorBoundary>
          <List>
            <ListSubheader>Modules</ListSubheader>
            {moduleNames.map((moduleName) => this.renderModule(libraryName, library.modules[moduleName]))}
            <ListSubheader>Libraries</ListSubheader>
            {libraryNames.map((libraryName) => this.renderLibrary(library.libraries[libraryName]))}
          </List>
        </ErrorBoundary>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LibrariesNav);
