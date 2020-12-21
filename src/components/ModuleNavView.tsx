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
import { Link, match } from "react-router-dom";
import { ToitLibrary, ToitModule } from "../model/toitsdk";
import {
  getLibrary,
  librarySegmentsToName,
  librarySegmentsToURI,
} from "../sdk";
import ErrorBoundary from "./ErrorPage";
import ListItemLink from "./ListItemLink";

interface ModuleNavParams {
  libName: string;
  moduleName: string;
}

const styles = (theme: Theme): StyleRules =>
  createStyles({
    sideMenu: {
      paddingTop: theme.spacing(2),
    },
    subHeader: {
      position: "sticky",
      height: theme.spacing(8),
      backgroundColor: "#ffffff",
    },
  });

export interface ModuleNavProps extends WithStyles<typeof styles> {
  libraries: { [libraryName: string]: ToitLibrary };
  match: match<ModuleNavParams>;
}

class ModuleNavView extends Component<ModuleNavProps> {
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

  render(): JSX.Element {
    const {
      params: { libName, moduleName },
    } = this.props.match;
    const library = getLibrary(this.props.libraries, libName);
    const moduleNames = library ? Object.keys(library.modules).sort() : [];
    return (
      <div className={this.props.classes.sideMenu}>
        <ErrorBoundary>
          <List
            component="nav"
            disablePadding
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                className={this.props.classes.subHeader}
              >
                <Link to={`/`}>Modules /</Link>
                <Typography color="secondary">{moduleName}</Typography>
              </ListSubheader>
            }
          >
            <br></br>
            {moduleNames.map((moduleName) =>
              this.renderModule(library, library.modules[moduleName])
            )}
          </List>
        </ErrorBoundary>
      </div>
    );
  }
}

export default withStyles(styles)(ModuleNavView);
