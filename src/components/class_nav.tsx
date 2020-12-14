// Copyright (C) 2020 Toitware ApS. All rights reserved.

import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, match } from "react-router-dom";
import { ToitLibraries } from "../model/toitsdk";
import { getLibrary, RootState } from "../sdk";
import ErrorBoundary from "./error_page";
import ListItemLink from "./list_item_link";

function mapStateToProps(
  state: RootState,
  props: ClassNavProps
): ClassNavProps {
  return {
    libraries: state.sdk.object?.libraries || {},
    match: props.match,
  };
}

interface ClassNavParams {
  libName: string;
  moduleName: string;
  className: string;
}

interface ClassNavProps {
  libraries: ToitLibraries;
  match: match<ClassNavParams>;
}

class ClassNav extends Component<ClassNavProps> {
  render(): JSX.Element {
    const {
      params: { libName, moduleName, className },
    } = this.props.match;

    const library = getLibrary(this.props.libraries, libName);
    const module = library && library.modules[moduleName];

    if (module) {
      const classes = module.classes
        .concat([])
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
                  <Link to={`/${libName}/${moduleName}`}>
                    {moduleName}
                  </Link>{" "}
                  <Link to={`/${libName}/${moduleName}/${className}`}>
                    {" / " + className}
                  </Link>
                </ListSubheader>
              }
            >
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
