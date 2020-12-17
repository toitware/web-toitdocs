// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  createStyles,
  StyleRules,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, match } from "react-router-dom";
import { ToitLibraries } from "../model/toitsdk";
import { getLibrary, RootState } from "../sdk";
import ErrorBoundary from "./ErrorPage";
import ListItemLink from "./ListItemLink";

function mapStateToProps(
  state: RootState,
  props: ClassNavProps
): ClassNavProps {
  return {
    libraries: state.sdk.object?.libraries || {},
    match: props.match,
    classes: props.classes,
  };
}

const styles = (theme: Theme): StyleRules =>
  createStyles({
    sideMenu: {
      padding: theme.spacing(3),
    },
  });

interface ClassNavParams {
  libName: string;
  moduleName: string;
  className: string;
}

interface ClassNavProps extends WithStyles<typeof styles> {
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
        <div className={this.props.classes.sideMenu}>
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

export default withStyles(styles)(connect(mapStateToProps)(ClassNav));
