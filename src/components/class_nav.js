// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ErrorBoundary from "./error_page";

function mapStateToProps(state, props) {
  const { sdk } = state;
  return {
    version: sdk.version,
    libraries: sdk.object.libraries,
    match: props.match,
  };
}

function ContentsOfNavbar(props) {
  return (
    <div>
      {[].concat(props.module.module_classes)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((klass, index) => {
          return (
            <Link
              to={`/${props.libName}/${props.moduleName}/${klass.name}`}
              key={klass.name}
            >
              <ListItem button>{klass.name}</ListItem>
            </Link>
          );
        })}
    </div>
  )
}

class ClassNav extends Component {
  render() {
    const {
      params: { libName, moduleName },
    } = this.props.match;
    const library = this.props.libraries.find(({ name }) => name === libName)
    const module = library ? library.modules.find(({ name }) => name === moduleName) : null

    if (module) {
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
              {" "}
              <ContentsOfNavbar
                module={module}
                libName={libName}
                moduleName={moduleName}
              />
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
