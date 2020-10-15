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
    let already_listed = [];
    const {
      params: { libName },
    } = this.props.match;
    console.log()
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
          {
          []
            .concat(library.lib_modules)
            .sort((a, b) => a.module.localeCompare(b.module))
            .map((lib_modules, index) => {
              if (!already_listed.includes(lib_modules.module)){
                already_listed.push(lib_modules.module);
              return (
                <Link
                  to={`/${libName}/${lib_modules.module}`}
                  key={lib_modules.module+"-"+index}
                >
                  <ListItem button>{lib_modules.module}</ListItem>
                </Link>
              );
            }
            return null;
            })}
        </List>
      </ErrorBoundary>
      </div>
    );
  }
};

export default connect(mapStateToProps)(ModuleNav);
