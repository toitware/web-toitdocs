// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  createStyles,
  List,
  StyleRules,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ToitLibraries } from "../model/toitsdk";
import { getLibrary } from "../sdk";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 300,
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
      paddingLeft: theme.spacing(4),
    },
  });

export interface LibraryInfoParams {
  libraryName: string;
}

export interface LibraryInfoProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<LibraryInfoParams> {
  libraries: ToitLibraries;
}

class LibraryInfo extends Component<LibraryInfoProps> {
  render(): JSX.Element {
    const library = getLibrary(
      this.props.libraries,
      this.props.match.params.libraryName
    );

    if (!library) {
      return this.notFound(this.props.match.params.libraryName);
    }

    const moduleNames = Object.keys(library.modules).sort();

    return (
      <>
        <div className={this.props.classes.heading}>
          <Typography component="h2" variant="h2">
            Library {library.name}
          </Typography>
        </div>
        <Box pt={2} pb={2}>
          <Box pt={1} pb={1}>
            <Typography component="h2" variant="h2">
              Modules
            </Typography>
          </Box>
          <Paper variant="outlined" className={this.props.classes.paper}>
            <List>
              {moduleNames.map((moduleName) => (
                <li key={"library-module-" + moduleName}>
                  {" "}
                  {library.modules[moduleName].name}{" "}
                </li>
              ))}
            </List>
          </Paper>
        </Box>
      </>
    );
  }

  notFound(name: string): JSX.Element {
    return (
      <Grid container className={this.props.classes.root}>
        <Grid item xs={9}>
          <Box pt={2} pb={2}>
            <Typography component="h1" variant="h1">
              ERROR:
              <p>Library: {name} not found</p>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(LibraryInfo);
