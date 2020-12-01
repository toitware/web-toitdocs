// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
// import ListSubheader from "@material-ui/core/ListSubheader";
import { Link, match } from "react-router-dom";
// import List from "@material-ui/core/List";
import ErrorBoundary from "./error_page";
import { getLibrary, RootState } from "../sdk";
// import ListItemLink from "./list_item_link";
import Typography from "@material-ui/core/Typography";
import { ToitLibraries } from "../model/toitsdk";
import Grid from "@material-ui/core/Grid";

function mapStateToProps(
  state: RootState,
  props: ClassNavProps
): ClassNavProps {
  return {
    libraries: state.sdk.object?.libraries || {},
    match: props.match,
  };
}

interface ClassNavParams {
  libName: string;
  moduleName: string;
  className: string;
}

interface ClassNavProps {
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
      // TODO: Add the list of classes
      //   const classes = module.classes
      //     .concat([])
      //     .sort((a, b) => a.name.localeCompare(b.name));

      return (
        <div style={{ paddingTop: "30px" }}>
          <ErrorBoundary>
            <Grid item container>
              <Typography color="secondary">
                <Grid item style={{ padding: "10px" }}>
                  <Link to={`/`}> Modules </Link>
                  {" / "}
                </Grid>
                <Grid item style={{ padding: "10px" }}>
                  <Link to={`/${libName}/${moduleName}`}>{moduleName}</Link>
                  {" / "}
                </Grid>
                <Grid item style={{ padding: "10px" }}>
                  {className}
                </Grid>
              </Typography>
            </Grid>
            {/* TODO: List the rest of the classes from module*/}
            {/* <Grid item container>
              <List component="nav" disablePadding>
                {classes.map((klass, index) => (
                  <ListItemLink
                    to={`/${libName}/${module.name}/${klass.name}`}
                    key={"class-index-" + index}
                    primary={klass.name}
                  />
                ))}
              </List>
            </Grid> */}
          </ErrorBoundary>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default connect(mapStateToProps)(ClassNav);
