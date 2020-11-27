// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  createStyles,
  makeStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { List } from "@material-ui/core";
import { getLibrary, RootState } from "../sdk";
import { match } from "react-router-dom";
import { ToitLibraries } from "../model/toitsdk";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const style = (theme: Theme) =>
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

function mapStateToProps(
  state: RootState,
  props: LibraryInfoProps
): LibraryInfoProps {
  return {
    ...props,
    libraries: state.object?.libraries || {},
  };
}

interface LibraryInfoParams {
  libName: string;
}

interface LibraryInfoProps extends WithStyles<typeof style> {
  libraries: ToitLibraries;
  match: match<LibraryInfoParams>;
}

class LibraryInfo extends Component<LibraryInfoProps> {
  render(): JSX.Element {
    const {
      params: { libName },
    } = this.props.match;
    const library = getLibrary(this.props.libraries, libName);
    const classes = this.props.classes;

    const moduleNames = Object.keys(library.modules).sort();

    if (library) {
      return (
        <Grid container>
          <Grid item xs={9}>
            <Box pt={2} pb={2}>
              <Typography component="h1" variant="h1">
                Library: {library.name}
              </Typography>
            </Box>
            <Box pt={2} pb={2}>
              <Box pt={1} pb={1}>
                <Typography component="h2" variant="h2">
                  Modules
                </Typography>
              </Box>
              <Paper variant="outlined" className={classes.paper}>
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
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container className={classes.root}>
          <Grid item xs={9}>
            <Box pt={2} pb={2}>
              <Typography component="h1" variant="h1">
                ERROR:
                <p>Library: {libName} not found</p>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      );
    }
  }
}

export default connect(mapStateToProps)(withStyles(style)(LibraryInfo));
