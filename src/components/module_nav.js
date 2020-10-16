// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component}  from "react";
import {connect} from "react-redux"
import { Link } from 'react-router-dom';
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemLink from "./list_item_link.js";
import List from "@material-ui/core/List";
import ErrorBoundary from "./error_page";
import { getLibrary, librarySegmentsToName } from "../sdk.js";

function mapStateToProps(state, props) {
  const { sdk } = state
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match }
}

//Listing modules for navigation purposes
class ModuleNav extends Component {

  renderModule(libraryName, module) {
    return <ListItemLink to={`/${libraryName}/${module.name}`} key={`/${libraryName}/${module.name}`} primary={module.name} />
  }

  render() {
    const { params: { libName } } = this.props.match;

    const library = getLibrary(this.props.libraries, libName);
    const moduleNames = Object.keys(library.modules).sort();
    const libraryName = librarySegmentsToName(library.path);

    return (
      <div className="sideMenu">
        <ErrorBoundary>
          <List
            component="nav"
            disablePadding
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                <Link to={`/`}>modules</Link>
                {" / "}
                {libraryName}
              </ListSubheader>
            }
          >
            {moduleNames.map((moduleName) => this.renderModule(libraryName, library.modules[moduleName]))}
          </List>
      </ErrorBoundary>
      </div>
    );
  }
};

export default connect(mapStateToProps)(ModuleNav);
