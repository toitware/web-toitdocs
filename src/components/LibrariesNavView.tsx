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
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { match } from "react-router-dom";
import { ToitLibraries, ToitLibrary, ToitModule } from "../model/toitsdk";
import {
  getLibrary,
  librarySegmentsToName,
  librarySegmentsToURI,
} from "../sdk";
import ErrorBoundary from "./ErrorPage";
import ListItemLink from "./ListItemLink";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    sideMenu: {
      paddingTop: theme.spacing(3),
    },
  });

interface LibrariesNavParams {
  libName: string;
}

export interface LibrariesNavProps extends WithStyles<typeof styles> {
  libraries: ToitLibraries;
  match: match<LibrariesNavParams>;
}

class LibrariesNav extends Component<LibrariesNavProps> {
  renderModule(library: ToitLibrary, module: ToitModule): JSX.Element {
    const libraryName = librarySegmentsToName(library.path);
    const libraryURI = librarySegmentsToURI(library.path);
    return (
      <ListItemLink
        to={`/${libraryURI}/${module.name}`}
        key={`/${libraryName}/${module.name}`}
        primary={module.name}
      />
    );
  }

  renderLibrary(library: ToitLibrary): JSX.Element {
    const libraryName = librarySegmentsToName(library.path);
    const libraryURI = librarySegmentsToName(library.path);
    return (
      <ListItemLink
        to={`/${libraryURI}`}
        key={`/${libraryName}`}
        primary={library.name}
      />
    );
  }

  render(): JSX.Element {
    const libName = this.props.match.params.libName;
    const library = getLibrary(this.props.libraries, libName);
    const moduleNames = Object.keys(library.modules).sort();
    const libraryNames = Object.keys(library.libraries).sort();

    return (
      <div className={this.props.classes.sideMenu}>
        <ErrorBoundary>
          <List>
            <div className={this.props.classes.sideMenu}>
              <ListSubheader>
                <Typography color="secondary">
                  <b>Libraries</b>
                </Typography>
              </ListSubheader>
            </div>
            <div className={this.props.classes.sideMenu}>
              {libraryNames.map((libraryName) =>
                this.renderLibrary(library.libraries[libraryName])
              )}
            </div>
            <div className={this.props.classes.sideMenu}>
              <ListSubheader>
                <Typography color="secondary">
                  <b>Modules</b>
                </Typography>
              </ListSubheader>
            </div>
            <div className={this.props.classes.sideMenu}>
              {moduleNames.map((moduleName) =>
                this.renderModule(library, library.modules[moduleName])
              )}
            </div>
          </List>
        </ErrorBoundary>
      </div>
    );
  }
}

export default withStyles(styles)(LibrariesNav);
