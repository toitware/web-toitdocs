// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import ListItemLink from "./list_item_link";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ErrorBoundary from "./error_page";
import {
  librarySegmentsToName,
  getLibrary,
  librarySegmentsToURI,
  RootState,
} from "../sdk";
import {
  Typography,
  WithStyles,
  createStyles,
  Theme,
  withStyles,
  StyleRules,
} from "@material-ui/core";
import { ToitLibraries, ToitLibrary, ToitModule } from "../model/toitsdk";
import { match } from "react-router-dom";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    sideMenu: {
      paddingTop: theme.spacing(2),
    },
  });

function mapStateToProps(
  state: RootState,
  props: LibrariesNavProps
): LibrariesNavProps {
  return {
    libraries: state.sdk.object?.libraries || {},
    match: props.match,
    classes: props.classes,
  };
}

interface LibrariesNavParams {
  libName: string;
}

interface LibrariesNavProps extends WithStyles<typeof styles> {
  libraries: ToitLibraries;
  match: match<LibrariesNavParams>;
}

//Listing the libraries for navigation purposes
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
      <div className="sideMenu">
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

export default withStyles(styles)(connect(mapStateToProps)(LibrariesNav));
