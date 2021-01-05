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
import { Link, RouteComponentProps } from "react-router-dom";
import { ToitLibraries } from "../model/toitsdk";
import { getLibrary } from "../sdk";
import ErrorBoundary from "./ErrorPage";
import ListItemLink from "./ListItemLink";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    sideMenu: {
      padding: theme.spacing(3),
    },
  });

export interface ClassNavParams {
  libraryName: string;
  moduleName: string;
  className: string;
}

export interface ClassNavProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<ClassNavParams> {
  libraries: ToitLibraries;
}

class ClassNavView extends Component<ClassNavProps> {
  render(): JSX.Element {
    const { libraryName, moduleName, className } = this.props.match.params;

    const library = getLibrary(this.props.libraries, libraryName);
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
                  <Link to={`/${libraryName}/${moduleName}`}>
                    {moduleName}
                  </Link>{" "}
                  <Link to={`/${libraryName}/${moduleName}/${className}`}>
                    {" / " + className}
                  </Link>
                </ListSubheader>
              }
            >
              {" "}
              {classes.map((klass, index) => (
                <ListItemLink
                  to={`/${libraryName}/${module.name}/${klass.name}`}
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

export default withStyles(styles)(ClassNavView);
