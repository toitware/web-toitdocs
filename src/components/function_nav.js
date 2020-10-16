// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component}  from "react";
import {connect} from "react-redux"
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ErrorBoundary from "./error_page";
import ListItemLink from "./list_item_link";
import { getLibrary, librarySegmentsToName } from "../sdk";

function mapStateToProps(state, props) {
  const { sdk } = state
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match }
};

class FunctionNav extends Component {
  render() {
    const {
      params: { libName, moduleName, className },
    } = this.props.match;

    const library = getLibrary(this.props.libraries, libName);
    const libraryName = librarySegmentsToName(library.path);
    const module = library && library.modules[moduleName];

    if (!module) {
      return "Module not found";
    }

    let class_info = module.classes.find(({ name }) => name === className);
    if (!class_info) {
      class_info = module.export_classes.find(({ name }) => name === className);
    }

    if (!class_info) {
      return "Class not found";
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
                {class_info.name}
              </Link>
            </ListSubheader>
          }
        >
          {class_info.structure.statics.map((stat, index) =>
            <ListItemLink to={`/${libName}/${moduleName}/${className}/statics/${stat.name}/${index}`} key={"stat-index-"+index} primary={stat.name} />
          )}
          {class_info.structure.constructors.map((constructor, index) =>
            <ListItemLink to={`/${libName}/${moduleName}/${className}/constructors/${constructor.name}/${index}`} key={"constructor-index-"+index} primary={constructor.name} />
          )}
          {class_info.structure.factories.map((factory, index) =>
            <ListItemLink to={`/${libName}/${moduleName}/${className}/factories/${factory.name}/${index}`} key={"factory-index-"+index} primary={factory.name} />
          )}
          {class_info.structure.methods.map((method, index) =>
            <ListItemLink to={`/${libName}/${moduleName}/${className}/methods/${method.name}/${index}`} key={"method-index-"+index} primary={method.name} />
          )}
          </List>
        </ErrorBoundary>
      </div>
    );
  }
};

export default connect(mapStateToProps)(FunctionNav);
