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
import clsx from "clsx";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, match } from "react-router-dom";
import { ToitLibrary, ToitModule } from "../model/toitsdk";
import {
  getLibrary,
  librarySegmentsToName,
  librarySegmentsToURI,
  RootState,
} from "../sdk";
import ErrorBoundary from "./ErrorPage";
import ListItemLink from "./ListItemLink";

function mapStateToProps(
  state: RootState,
  props: ModuleNavProps
): ModuleNavProps {
  return {
    version: state.sdk.version,
    libraries: state.sdk.object?.libraries || {},
    match: props.match,
    classes: props.classes,
  };
}

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

interface ModuleNavProps extends WithStyles<typeof styles> {
  version?: string;
  libraries: { [libraryName: string]: ToitLibrary };
  match: match<ModuleNavParams>;
}

class ModuleNav extends Component<ModuleNavProps> {
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
      <div className={clsx(this.props.classes.sideMenu, "sideMenu")}>
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

export default withStyles(styles)(connect(mapStateToProps)(ModuleNav));
