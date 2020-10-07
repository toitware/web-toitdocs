// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component}  from "react";
import {connect} from "react-redux"
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ErrorBoundary from "./error_page";

function mapStateToProps(state, props) {
  const { sdk } = state
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match }
}

//Listing modules for navigation purposes
class ModuleNav extends Component {
  render() {
    const {
      params: { libName },
    } = this.props.match;
    let library = this.props.libraries.find(({ lib_name }) => lib_name === libName);
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
              {libName}
            </ListSubheader>
          }
        >
          {[]
            .concat(library.lib_modules)
            .sort((a, b) => a.module.localeCompare(b.module))
            .map((lib_modules, index) => {
              return (
                <Link
                  to={`/${libName}/${lib_modules.module}`}
                  key={lib_modules.module+"-"+index}
                >
                  <ListItem button>{lib_modules.module}</ListItem>
                </Link>
              );
            })}
        </List>
      </ErrorBoundary>
      </div>
    );
  }
};

export default connect(mapStateToProps)(ModuleNav);
