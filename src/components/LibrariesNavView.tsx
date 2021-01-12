// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  createStyles,
  StyleRules,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ToitLibraries, ToitLibrary, ToitModule } from "../generator/sdk";
import {
  getLibrary,
  librarySegmentsToName,
  librarySegmentsToURI,
} from "../redux/sdk";
import ErrorBoundary from "./ErrorPage";
import ListItemLink from "./ListItemLink";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    sideMenu: {
      padding: theme.spacing(2),
    },
    subList: {
      paddingBottom: theme.spacing(2),
    },
    subListHeader: {
      paddingBottom: theme.spacing(2),
    },
  });

export interface LibrariesNavParams {
  libraryName: string;
}

export interface LibrariesNavProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<LibrariesNavParams> {
  libraries: ToitLibraries;
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
    const library = getLibrary(
      this.props.libraries,
      this.props.match.params.libraryName
    );

    if (!library) {
      return <></>;
    }

    const moduleNames = Object.keys(library.modules).sort();
    const libraryNames = Object.keys(library.libraries).sort();

    return (
      <div className={this.props.classes.sideMenu}>
        <ErrorBoundary>
          <List>
            <div className={this.props.classes.subList}>
              <Typography
                variant="h5"
                className={this.props.classes.subListHeader}
              >
                Libraries
              </Typography>
              {libraryNames.map((libraryName) =>
                this.renderLibrary(library.libraries[libraryName])
              )}
            </div>
            <div className={this.props.classes.subList}>
              <Typography
                variant="h5"
                className={this.props.classes.subListHeader}
              >
                Modules
              </Typography>
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
