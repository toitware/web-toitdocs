// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link, match } from "react-router-dom";
import List from "@material-ui/core/List";
import ErrorBoundary from "./error_page";
import ListItemLink from "./list_item_link";
import { getLibrary, librarySegmentsToName, RootState } from "../sdk";
import { ToitLibraries } from "../model/toitsdk";

function mapStateToProps(
  state: RootState,
  props: FunctionNavProps
): FunctionNavProps {
  return {
    libraries: state.object?.libraries || {},
    match: props.match,
  };
}

interface FunctionNavParams {
  libName: string;
  moduleName: string;
  className: string;
}

interface FunctionNavProps {
  libraries: ToitLibraries;
  match: match<FunctionNavParams>;
}

class FunctionNav extends Component<FunctionNavProps> {
  render(): JSX.Element {
    const {
      params: { libName, moduleName, className },
    } = this.props.match;

    const library = getLibrary(this.props.libraries, libName);
    const libraryName = librarySegmentsToName(library.path);
    const module = library && library.modules[moduleName];

    if (!module) {
      return <>Module not found</>;
    }

    let classInfo = module.classes.find(({ name }) => name === className);
    if (!classInfo) {
      classInfo = module.export_classes.find(({ name }) => name === className);
    }

    if (!classInfo) {
      return <>Class not found</>;
    }

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
                <Link to={`/${libName}`}>{libraryName}</Link>
                {" / "}
                <Link to={`/${libName}/${moduleName}`}>{module.name}</Link>
                {" / "}
                <Link to={`/${libName}/${moduleName}/${className}`}>
                  {classInfo.name}
                </Link>
              </ListSubheader>
            }
          >
            {classInfo.structure.statics.map((stat, index) => (
              <ListItemLink
                to={`/${libName}/${moduleName}/${className}/statics/${stat.name}/${index}`}
                key={"stat-index-" + index}
                primary={stat.name}
              />
            ))}
            {classInfo.structure.constructors.map((constructor, index) => (
              <ListItemLink
                to={`/${libName}/${moduleName}/${className}/constructors/${constructor.name}/${index}`}
                key={"constructor-index-" + index}
                primary={constructor.name}
              />
            ))}
            {classInfo.structure.factories.map((factory, index) => (
              <ListItemLink
                to={`/${libName}/${moduleName}/${className}/factories/${factory.name}/${index}`}
                key={"factory-index-" + index}
                primary={factory.name}
              />
            ))}
            {classInfo.structure.methods.map((method, index) => (
              <ListItemLink
                to={`/${libName}/${moduleName}/${className}/methods/${method.name}/${index}`}
                key={"method-index-" + index}
                primary={method.name}
              />
            ))}
          </List>
        </ErrorBoundary>
      </div>
    );
  }
}

export default connect(mapStateToProps)(FunctionNav);
