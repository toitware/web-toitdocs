// Copyright (C) 2020 Toitware ApS. All rights reserved.
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }]*/

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

class ClassNav extends Component {
  render() {
    const {
      params: { libName, moduleName, _ },
    } = this.props.match;
    const modules = this.props.libraries
      .find(({ lib_name }) => lib_name === libName)
      .lib_modules.find(({ module }) => module === moduleName);
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
              <Link to={`/${libName}`}>{libName}</Link>
              {" / "}
              <Link to={`/${libName}/${moduleName}`}>{moduleName}</Link>
            </ListSubheader>
          }
        >
          {[]
            .concat(modules.module_classes)
            .sort((a, b) => a.class_name.localeCompare(b.class_name))
            .map((classinfo) => {
              return (
                <Link
                  to={`/${libName}/${moduleName}/${classinfo.class_name}`}
                  key={classinfo.class_name}
                >
                  <ListItem button>{classinfo.class_name}</ListItem>
                </Link>
              );
            })}
        </List>
        </ErrorBoundary>
      </div>
    );
  }
};

export default connect(mapStateToProps)(ClassNav);
