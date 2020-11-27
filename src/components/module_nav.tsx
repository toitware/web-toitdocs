// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, match } from "react-router-dom";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemLink from "./list_item_link";
import List from "@material-ui/core/List";
import ErrorBoundary from "./error_page";
import {
  getLibrary,
  librarySegmentsToName,
  librarySegmentsToURI,
  RootState,
} from "../sdk";
import Typography from "@material-ui/core/Typography";
import { ToitLibrary, ToitModule } from "../model/toitsdk";

function mapStateToProps(
  state: RootState,
  props: ModuleNavProps
): ModuleNavProps {
  return {
    version: state.version,
    libraries: state.object?.libraries || {},
    match: props.match,
  };
}

interface ModuleNavParams {
  libName: string;
  moduleName: string;
}

interface ModuleNavProps {
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
      <div className="sideMenu" style={{ paddingTop: "20px" }}>
        <ErrorBoundary>
          <List
            component="nav"
            disablePadding
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
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

export default connect(mapStateToProps)(ModuleNav);
